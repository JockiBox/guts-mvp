'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFriends, type UserProfile, supabase } from '@/lib/supabase';
import { playClick } from '@/lib/sounds';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface FriendRequest {
  id: string;
  from_user_id: string;
  from_username: string;
  from_avatar_emoji: string;
  from_avatar_color: string;
  created_at: string;
}

export function FriendsModal({ isOpen, onClose, user }: FriendsModalProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    const friendsList = await getFriends(user.id);
    setFriends(friendsList);
    setLoading(false);
  }, [user.id]);

  const loadRequests = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('friend_requests')
        .select(`
          id,
          from_user_id,
          created_at,
          from_profile:profiles!from_user_id(username, avatar_emoji, avatar_color)
        `)
        .eq('to_user_id', user.id)
        .eq('status', 'pending');

      const mappedRequests = data?.map((r: Record<string, unknown>) => {
        const profile = r.from_profile as Record<string, string> | null;
        return {
          id: r.id as string,
          from_user_id: r.from_user_id as string,
          from_username: profile?.username || 'Unknown',
          from_avatar_emoji: profile?.avatar_emoji || '😎',
          from_avatar_color: profile?.avatar_color || '#14b8a6',
          created_at: r.created_at as string,
        };
      }) || [];

      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  }, [user.id]);

  useEffect(() => {
    if (isOpen) {
      loadFriends();
      loadRequests();
    }
  }, [isOpen, loadFriends, loadRequests]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_emoji, avatar_color, tokens, vip_level')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10);

      setSearchResults((data as UserProfile[]) || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setSearchLoading(false);
  };

  const handleSendRequest = async (toUserId: string) => {
    playClick();
    try {
      // Check if request already exists
      const { data: existing } = await supabase
        .from('friend_requests')
        .select('id')
        .eq('from_user_id', user.id)
        .eq('to_user_id', toUserId)
        .single();

      if (existing) {
        setMessage({ type: 'error', text: 'Request already sent' });
        return;
      }

      // Check if already friends
      const isFriend = friends.some((f) => f.id === toUserId);
      if (isFriend) {
        setMessage({ type: 'error', text: 'Already friends!' });
        return;
      }

      await supabase.from('friend_requests').insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        status: 'pending',
      });

      setMessage({ type: 'success', text: 'Friend request sent!' });
      setSearchResults(searchResults.filter((r) => r.id !== toUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      setMessage({ type: 'error', text: 'Failed to send request' });
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    playClick();
    try {
      const { data: request } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) return;

      // Create friendship (both directions)
      await supabase.from('friendships').insert([
        { user_id: request.from_user_id, friend_id: request.to_user_id },
        { user_id: request.to_user_id, friend_id: request.from_user_id },
      ]);

      // Update request status
      await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      setRequests(requests.filter((r) => r.id !== requestId));
      loadFriends();
      setMessage({ type: 'success', text: 'Friend request accepted!' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    playClick();
    try {
      await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      setRequests(requests.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#14b8a6', fontSize: '24px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👥</span> Friends
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '16px',
            background: '#0f172a',
            borderRadius: '10px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => {
              playClick();
              setActiveTab('friends');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'friends' ? '#14b8a6' : 'transparent',
              color: activeTab === 'friends' ? '#0f172a' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('requests');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'requests' ? '#14b8a6' : 'transparent',
              color: activeTab === 'requests' ? '#0f172a' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            Requests
            {requests.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '8px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '10px',
                }}
              >
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('add');
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'add' ? '#14b8a6' : 'transparent',
              color: activeTab === 'add' ? '#0f172a' : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: message.type === 'success' ? '#4ade80' : '#f87171',
              fontSize: '14px',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading...</div>
            ) : friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>😢</div>
                <div style={{ color: '#64748b' }}>No friends yet</div>
                <p style={{ color: '#475569', fontSize: '13px', marginTop: '8px' }}>
                  Add friends to challenge them!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    style={{
                      background: '#0f172a',
                      borderRadius: '10px',
                      padding: '12px',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: friend.avatar_color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {friend.avatar_emoji}
                      </div>
                      <div>
                        <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '14px' }}>{friend.username}</div>
                        <div style={{ color: '#fbbf24', fontSize: '12px' }}>🪙 {friend.tokens?.toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#14b8a6',
                        background: 'rgba(20, 184, 166, 0.1)',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <div>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <div style={{ color: '#64748b' }}>No pending requests</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {requests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      background: '#0f172a',
                      borderRadius: '10px',
                      padding: '12px',
                      border: '1px solid #334155',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: request.from_avatar_color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {request.from_avatar_emoji}
                      </div>
                      <div>
                        <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '14px' }}>
                          {request.from_username}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Wants to be friends</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'white',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#94a3b8',
                          background: 'transparent',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Friends */}
        {activeTab === 'add' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by username..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                style={{
                  padding: '12px 20px',
                  background: '#14b8a6',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {searchLoading ? '...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    style={{
                      background: '#0f172a',
                      borderRadius: '10px',
                      padding: '12px',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: result.avatar_color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {result.avatar_emoji}
                      </div>
                      <div style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '14px' }}>{result.username}</div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(result.id)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'white',
                        background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

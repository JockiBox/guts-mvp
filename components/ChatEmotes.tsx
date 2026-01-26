'use client';

import { useState, useEffect } from 'react';
import {
  ChatEmote,
  ChatMessage,
  CHAT_EMOTES,
  QUICK_MESSAGES,
  sendEmote,
  getRecentMessages,
  canSendEmote,
  recordEmoteSent,
  getCooldownRemaining,
  getEmotesByCategory,
} from '@/lib/chatEmotes';

interface ChatEmotesProps {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  onEmoteSent?: (emote: ChatEmote) => void;
  compact?: boolean;
}

export function ChatEmotesPanel({ playerId, playerName, playerAvatar, onEmoteSent, compact = false }: ChatEmotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChatEmote['category']>('reaction');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getCooldownRemaining(playerId);
      setCooldown(remaining);
    }, 100);
    return () => clearInterval(interval);
  }, [playerId]);

  const handleSendEmote = (emote: ChatEmote) => {
    if (!canSendEmote(playerId)) return;

    sendEmote(emote, playerId, playerName, playerAvatar);
    recordEmoteSent(playerId);
    onEmoteSent?.(emote);
    setIsOpen(false);
  };

  const categories: Array<{ key: ChatEmote['category']; icon: string; label: string }> = [
    { key: 'reaction', icon: '😮', label: 'React' },
    { key: 'taunt', icon: '😏', label: 'Taunt' },
    { key: 'friendly', icon: '👋', label: 'Friendly' },
    { key: 'celebration', icon: '🎉', label: 'Celebrate' },
  ];

  if (compact) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={cooldown > 0}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: cooldown > 0 ? '#1e293b' : 'linear-gradient(135deg, #1e293b, #334155)',
            color: cooldown > 0 ? '#64748b' : '#f1f5f9',
            cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          💬
          {cooldown > 0 && <span style={{ fontSize: '10px' }}>{Math.ceil(cooldown / 1000)}s</span>}
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              background: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #334155',
              padding: '12px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              width: '200px',
              zIndex: 100,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {CHAT_EMOTES.slice(0, 12).map((emote) => (
              <button
                key={emote.id}
                onClick={() => handleSendEmote(emote)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0f172a',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                title={emote.label}
              >
                {emote.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        overflow: 'hidden',
      }}
    >
      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #334155',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              background: activeCategory === cat.key ? '#334155' : 'transparent',
              color: activeCategory === cat.key ? '#f1f5f9' : '#64748b',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Emotes Grid */}
      <div
        style={{
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
        }}
      >
        {getEmotesByCategory(activeCategory).map((emote) => (
          <button
            key={emote.id}
            onClick={() => handleSendEmote(emote)}
            disabled={cooldown > 0}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: cooldown > 0 ? '#1e293b' : '#0f172a',
              fontSize: '22px',
              cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              opacity: cooldown > 0 ? 0.5 : 1,
              transition: 'transform 0.2s, background 0.2s',
            }}
            title={emote.label}
          >
            {emote.emoji}
          </button>
        ))}
      </div>

      {/* Quick Messages */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #334155',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        {QUICK_MESSAGES.slice(0, 4).map((msg) => (
          <button
            key={msg.id}
            onClick={() => {
              const emote: ChatEmote = {
                id: msg.id,
                emoji: msg.emoji,
                label: msg.text,
                category: 'friendly',
              };
              handleSendEmote(emote);
            }}
            disabled={cooldown > 0}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#94a3b8',
              fontSize: '11px',
              cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              opacity: cooldown > 0 ? 0.5 : 1,
            }}
          >
            {msg.emoji} {msg.text}
          </button>
        ))}
      </div>

      {/* Cooldown Indicator */}
      {cooldown > 0 && (
        <div
          style={{
            padding: '8px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '11px',
            background: '#0f172a',
          }}
        >
          Wait {Math.ceil(cooldown / 1000)}s...
        </div>
      )}
    </div>
  );
}

// Floating emote display (shows when emote is sent)
export function FloatingChatEmote({
  message,
  position,
}: {
  message: ChatMessage;
  position: { x: number; y: number };
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const animationClass = message.emote.animation || 'bounce';

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        animation: `${animationClass} 0.5s ease, fadeUp 2s ease forwards`,
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          border: '1px solid #334155',
        }}
      >
        <span style={{ fontSize: '10px' }}>{message.senderAvatar}</span>
        <span style={{ fontSize: '24px' }}>{message.emote.emoji}</span>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-5deg); }
          75% { transform: translate(-50%, -50%) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -100%); }
        }
      `}</style>
    </div>
  );
}

// Emote button for quick access
export function QuickEmoteButton({
  playerId,
  playerName,
  playerAvatar,
  onEmoteSent,
}: Omit<ChatEmotesProps, 'compact'>) {
  return (
    <ChatEmotesPanel
      playerId={playerId}
      playerName={playerName}
      playerAvatar={playerAvatar}
      onEmoteSent={onEmoteSent}
      compact
    />
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { moderateMessage, QUICK_CHAT_MESSAGES, isUserMuted } from '@/lib/chatModeration';

interface ChatMessage {
  id: string;
  sender: string;
  senderColor: string;
  senderEmoji: string;
  content: string;
  timestamp: Date;
  isQuickChat: boolean;
  isSystem: boolean;
}

interface GameChatProps {
  roomCode: string;
  userId: string;
  username: string;
  userColor: string;
  userEmoji: string;
  onSend?: (message: string) => void;
  messages?: ChatMessage[];
  isEnabled?: boolean;
  isCompact?: boolean;
}

export default function GameChat({
  roomCode,
  userId,
  username,
  userColor,
  userEmoji,
  onSend,
  messages: externalMessages,
  isEnabled = true,
  isCompact = false,
}: GameChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(externalMessages || []);
  const [inputValue, setInputValue] = useState('');
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external messages if provided
  useEffect(() => {
    if (externalMessages) {
      setMessages(externalMessages);
    }
  }, [externalMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string, isQuickChat = false) => {
    if (!isEnabled) {
      setError('Chat is disabled');
      return;
    }

    if (isUserMuted(userId)) {
      setError('You are temporarily muted');
      return;
    }

    // Moderate the message
    const result = moderateMessage(content, userId, {
      filterBadWords: !isQuickChat,
      checkSpam: !isQuickChat,
      checkRateLimit: true,
      maxLength: 200,
    });

    if (!result.allowed) {
      setError(result.reason || 'Message not allowed');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: username,
      senderColor: userColor,
      senderEmoji: userEmoji,
      content: result.filtered || content,
      timestamp: new Date(),
      isQuickChat,
      isSystem: false,
    };

    // Add to local state (in real app, would send to server)
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setError(null);

    // Callback for parent to handle sending
    onSend?.(result.filtered || content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
    }
  };

  const handleQuickChat = (message: typeof QUICK_CHAT_MESSAGES[0]) => {
    sendMessage(`${message.emoji} ${message.text}`, true);
    setShowQuickChat(false);
  };

  if (!isEnabled) {
    return (
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.9)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #334155',
          textAlign: 'center',
          color: '#64748b',
        }}
      >
        Chat is disabled
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        height: isCompact ? '200px' : '300px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.5)',
        }}
      >
        <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '14px' }}>
          Room Chat
        </span>
        <span style={{ color: '#64748b', fontSize: '12px' }}>
          {roomCode}
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: msg.isSystem ? '#334155' : msg.senderColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {msg.isSystem ? '🎮' : msg.senderEmoji}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span
                    style={{
                      color: msg.isSystem ? '#94a3b8' : msg.senderColor,
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    {msg.sender}
                  </span>
                  <span style={{ color: '#475569', fontSize: '10px' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  style={{
                    color: msg.isSystem ? '#94a3b8' : msg.isQuickChat ? '#14b8a6' : '#e2e8f0',
                    fontSize: '13px',
                    wordBreak: 'break-word',
                    fontStyle: msg.isSystem ? 'italic' : 'normal',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: '6px 14px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderTop: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '12px',
          }}
        >
          {error}
        </div>
      )}

      {/* Quick chat panel */}
      {showQuickChat && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px',
            padding: '10px 14px',
            borderTop: '1px solid #334155',
            background: 'rgba(15, 23, 42, 0.5)',
          }}
        >
          {QUICK_CHAT_MESSAGES.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleQuickChat(msg)}
              style={{
                background: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '8px',
                padding: '8px 4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)';
              }}
            >
              <span style={{ fontSize: '18px' }}>{msg.emoji}</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{msg.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '10px 14px',
          borderTop: '1px solid #334155',
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.5)',
        }}
      >
        {/* Quick chat toggle */}
        <button
          type="button"
          onClick={() => setShowQuickChat(!showQuickChat)}
          style={{
            background: showQuickChat ? 'rgba(20, 184, 166, 0.3)' : 'rgba(51, 65, 85, 0.5)',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '0 12px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
          }}
          title="Quick Chat"
        >
          ⚡
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
          style={{
            flex: 1,
            background: 'rgba(51, 65, 85, 0.5)',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none',
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputValue.trim()}
          style={{
            background: inputValue.trim()
              ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
              : 'rgba(51, 65, 85, 0.5)',
            border: 'none',
            borderRadius: '8px',
            padding: '0 16px',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
        >
          Send
        </button>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Mini chat bubble for in-game use
export function ChatBubble({
  message,
  senderColor,
}: {
  message: string;
  senderColor: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '12px',
        padding: '8px 12px',
        border: `2px solid ${senderColor}`,
        maxWidth: '200px',
        animation: 'bubbleIn 0.3s ease-out, bubbleOut 0.3s ease-out 2.5s forwards',
      }}
    >
      <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{message}</span>
      <style jsx>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bubbleOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// Floating quick chat for mobile
export function FloatingQuickChat({
  onSelect,
  onClose,
}: {
  onSelect: (message: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30, 41, 59, 0.98)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #334155',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: 200,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ color: '#94a3b8', fontWeight: '600' }}>Quick Chat</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
        }}
      >
        {QUICK_CHAT_MESSAGES.map((msg) => (
          <button
            key={msg.id}
            onClick={() => {
              onSelect(`${msg.emoji} ${msg.text}`);
              onClose();
            }}
            style={{
              background: 'rgba(20, 184, 166, 0.15)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '12px',
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '24px' }}>{msg.emoji}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.text}</span>
          </button>
        ))}
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

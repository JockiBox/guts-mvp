'use client';

import { useState } from 'react';
import {
  share,
  ShareContent,
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  shareViaSMS,
  shareViaEmail,
  copyToClipboard,
  canShare,
} from '@/lib/socialSharing';
import { playClick, playTokens } from '@/lib/sounds';

interface ShareButtonProps {
  content: ShareContent;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  showOptions?: boolean;
  onShare?: (method: string) => void;
}

export function ShareButton({
  content,
  size = 'medium',
  variant = 'primary',
  showOptions = true,
  onShare,
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    playClick();

    if (showOptions && !canShare()) {
      setShowMenu(true);
      return;
    }

    const result = await share(content);
    if (result.success) {
      onShare?.(result.method);
      if (result.method === 'copy') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleOptionClick = async (method: string) => {
    playClick();
    setShowMenu(false);

    switch (method) {
      case 'twitter':
        shareToTwitter(content);
        break;
      case 'facebook':
        shareToFacebook(content);
        break;
      case 'whatsapp':
        shareToWhatsApp(content);
        break;
      case 'sms':
        shareViaSMS(content);
        break;
      case 'email':
        shareViaEmail(content);
        break;
      case 'copy':
        const success = await copyToClipboard(
          `${content.text}${content.url ? `\n${content.url}` : ''}`
        );
        if (success) {
          playTokens();
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
    }
    onShare?.(method);
  };

  const sizeStyles = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '10px 16px', fontSize: '14px' },
    large: { padding: '14px 24px', fontSize: '16px' },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#60a5fa',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#94a3b8',
      border: '1px solid #334155',
    },
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleShare}
        style={{
          ...sizeStyles[size],
          ...variantStyles[variant],
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
        }}
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <span>📤</span>
            <span>Share</span>
          </>
        )}
      </button>

      {/* Share Menu */}
      {showMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setShowMenu(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #334155',
              padding: '8px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
              zIndex: 1000,
              minWidth: '180px',
            }}
          >
            <ShareOption
              icon="📋"
              label={copied ? 'Copied!' : 'Copy Link'}
              onClick={() => handleOptionClick('copy')}
            />
            <ShareOption
              icon="𝕏"
              label="Twitter / X"
              onClick={() => handleOptionClick('twitter')}
            />
            <ShareOption
              icon="📘"
              label="Facebook"
              onClick={() => handleOptionClick('facebook')}
            />
            <ShareOption
              icon="💬"
              label="WhatsApp"
              onClick={() => handleOptionClick('whatsapp')}
            />
            <ShareOption
              icon="📱"
              label="SMS"
              onClick={() => handleOptionClick('sms')}
            />
            <ShareOption
              icon="📧"
              label="Email"
              onClick={() => handleOptionClick('email')}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ShareOption({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: '#cbd5e1',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Compact share buttons row
export function ShareButtonRow({
  content,
  onShare,
}: {
  content: ShareContent;
  onShare?: (method: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    playClick();
    const success = await copyToClipboard(
      `${content.text}${content.url ? `\n${content.url}` : ''}`
    );
    if (success) {
      playTokens();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.('copy');
    }
  };

  const iconButtonStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid #334155',
    background: '#0f172a',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <button
        onClick={handleCopy}
        style={{
          ...iconButtonStyle,
          background: copied ? 'rgba(34, 197, 94, 0.2)' : '#0f172a',
          border: copied ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid #334155',
        }}
        title="Copy link"
      >
        {copied ? '✓' : '📋'}
      </button>
      <button
        onClick={() => {
          playClick();
          shareToTwitter(content);
          onShare?.('twitter');
        }}
        style={iconButtonStyle}
        title="Share on Twitter"
      >
        𝕏
      </button>
      <button
        onClick={() => {
          playClick();
          shareToWhatsApp(content);
          onShare?.('whatsapp');
        }}
        style={iconButtonStyle}
        title="Share on WhatsApp"
      >
        💬
      </button>
      <button
        onClick={() => {
          playClick();
          shareViaEmail(content);
          onShare?.('email');
        }}
        style={iconButtonStyle}
        title="Share via Email"
      >
        📧
      </button>
    </div>
  );
}

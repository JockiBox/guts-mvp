'use client';

import { PlayerAvatar as AvatarType, getItemById, getRarityColor } from '@/lib/avatars';

interface PlayerAvatarProps {
  avatar: AvatarType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFrame?: boolean;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export function PlayerAvatar({ avatar, size = 'md', showFrame = true, onClick, isHighlighted }: PlayerAvatarProps) {
  const sizeMap = {
    sm: { width: 48, height: 48, fontSize: 24 },
    md: { width: 80, height: 80, fontSize: 40 },
    lg: { width: 120, height: 120, fontSize: 60 },
    xl: { width: 160, height: 160, fontSize: 80 },
  };

  const { width, height, fontSize } = sizeMap[size];

  // Get emoji representations for each part
  const baseItem = getItemById(avatar.base);
  const hatItem = avatar.hat ? getItemById(avatar.hat) : null;
  const glassesItem = avatar.glasses ? getItemById(avatar.glasses) : null;
  const accessoryItem = avatar.accessory ? getItemById(avatar.accessory) : null;
  const bgItem = avatar.background ? getItemById(avatar.background) : null;
  const frameItem = avatar.frame ? getItemById(avatar.frame) : null;

  // Get background style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!bgItem || bgItem.id === 'bg_none') {
      return { background: 'linear-gradient(135deg, #1e293b, #0f172a)' };
    }

    switch (bgItem.id) {
      case 'bg_fire':
        return {
          background: 'linear-gradient(135deg, #dc2626, #f97316, #eab308)',
          animation: 'pulse 2s ease-in-out infinite',
        };
      case 'bg_sparkle':
        return {
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
        };
      case 'bg_money':
        return {
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
        };
      case 'bg_hearts':
        return {
          background: 'linear-gradient(135deg, #ec4899, #f472b6)',
        };
      case 'bg_lightning':
        return {
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)',
        };
      case 'bg_rainbow':
        return {
          background: 'linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
        };
      case 'bg_galaxy':
        return {
          background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
        };
      default:
        return { background: 'linear-gradient(135deg, #1e293b, #0f172a)' };
    }
  };

  // Get frame style
  const getFrameStyle = (): React.CSSProperties => {
    if (!showFrame || !frameItem || frameItem.id === 'frame_none') {
      return { border: '3px solid #334155' };
    }

    switch (frameItem.id) {
      case 'frame_gold':
        return {
          border: '4px solid #fbbf24',
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.5), inset 0 0 10px rgba(251, 191, 36, 0.2)',
        };
      case 'frame_diamond':
        return {
          border: '4px solid #e0f2fe',
          boxShadow: '0 0 20px rgba(224, 242, 254, 0.8), 0 0 40px rgba(147, 197, 253, 0.4)',
        };
      case 'frame_fire':
        return {
          border: '4px solid #f97316',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)',
          animation: 'pulse 1.5s ease-in-out infinite',
        };
      case 'frame_neon':
        return {
          border: '4px solid #a855f7',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.4)',
        };
      case 'frame_pixel':
        return {
          border: '4px solid #22c55e',
          borderStyle: 'double',
        };
      default:
        return { border: '3px solid #334155' };
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
        ...getBackgroundStyle(),
        ...getFrameStyle(),
      }}
    >
      {/* Base character */}
      <span style={{ fontSize, position: 'relative', zIndex: 2 }}>
        {baseItem?.emoji || '😊'}
      </span>

      {/* Hat overlay (top) */}
      {hatItem && hatItem.id !== 'hat_none' && (
        <span
          style={{
            position: 'absolute',
            top: -fontSize * 0.3,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: fontSize * 0.6,
            zIndex: 3,
          }}
        >
          {hatItem.emoji}
        </span>
      )}

      {/* Glasses overlay (middle) */}
      {glassesItem && glassesItem.id !== 'glasses_none' && (
        <span
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: fontSize * 0.4,
            zIndex: 4,
            opacity: 0.9,
          }}
        >
          {glassesItem.emoji}
        </span>
      )}

      {/* Accessory overlay (bottom right) */}
      {accessoryItem && accessoryItem.id !== 'acc_none' && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            fontSize: fontSize * 0.4,
            zIndex: 4,
          }}
        >
          {accessoryItem.emoji}
        </span>
      )}

      {/* Click indicator */}
      {onClick && (
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            color: 'white',
            fontWeight: 'bold',
            zIndex: 5,
          }}
        >
          ✏️
        </div>
      )}
    </div>
  );
}

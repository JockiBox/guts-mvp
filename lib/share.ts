'use client';

// Share functionality - create shareable game results

export interface ShareData {
  result: 'win' | 'lose' | 'drop';
  handDescription: string;
  potSize: number;
  roundNumber: number;
  opponentCount: number;
  isSixNine?: boolean;
  beatGhost?: boolean;
}

// Generate share text
export function generateShareText(data: ShareData): string {
  const emoji = data.result === 'win' ? '🏆' : data.result === 'lose' ? '💀' : '🃏';
  const sixNine = data.isSixNine ? ' 😏 SIX-NINE!' : '';
  const ghost = data.beatGhost ? ' 👻 Beat the ghost!' : '';

  let text = `${emoji} GUTS Round ${data.roundNumber}\n`;
  text += `Hand: ${data.handDescription}${sixNine}\n`;

  if (data.result === 'win') {
    text += `Won ${data.potSize} tokens!${ghost}\n`;
  } else if (data.result === 'lose') {
    text += `Lost to ${data.opponentCount} opponent${data.opponentCount > 1 ? 's' : ''}\n`;
  } else {
    text += `Dropped out safely\n`;
  }

  text += `\nPlay GUTS: guts-mvp.vercel.app`;

  return text;
}

// Check if Web Share API is available
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

// Share using native share API
export async function shareResult(data: ShareData): Promise<boolean> {
  const text = generateShareText(data);

  if (canShare()) {
    try {
      await navigator.share({
        title: 'GUTS - High Stakes Poker',
        text,
        url: 'https://guts-mvp.vercel.app',
      });
      return true;
    } catch (e) {
      // User cancelled or error
      console.log('Share cancelled or failed:', e);
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Copy failed:', e);
  }

  return false;
}

// Generate a simple result card as data URL (for visual sharing)
export function generateResultCard(data: ShareData): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.5, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // Border
  ctx.strokeStyle = data.result === 'win' ? '#14b8a6' : data.result === 'lose' ? '#ef4444' : '#64748b';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 580, 380);

  // Title
  ctx.font = 'bold 48px system-ui, sans-serif';
  ctx.fillStyle = '#14b8a6';
  ctx.textAlign = 'center';
  ctx.fillText('GUTS', 300, 70);

  // Result
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillStyle = data.result === 'win' ? '#4ade80' : data.result === 'lose' ? '#f87171' : '#94a3b8';
  const resultText = data.result === 'win' ? '🏆 WINNER!' : data.result === 'lose' ? '💀 LOST' : '🃏 DROPPED';
  ctx.fillText(resultText, 300, 140);

  // Hand
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillStyle = data.isSixNine ? '#f472b6' : '#fbbf24';
  ctx.fillText(data.handDescription, 300, 200);

  if (data.isSixNine) {
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('😏 NICE!', 300, 240);
  }

  // Stats
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Round ${data.roundNumber} • ${data.opponentCount} opponents`, 300, 290);

  if (data.result === 'win') {
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`+${data.potSize} tokens`, 300, 330);
  }

  // URL
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('guts-mvp.vercel.app', 300, 375);

  return canvas.toDataURL('image/png');
}

// Download result card
export function downloadResultCard(data: ShareData): void {
  const dataUrl = generateResultCard(data);
  if (!dataUrl) return;

  const link = document.createElement('a');
  link.download = `guts-round-${data.roundNumber}.png`;
  link.href = dataUrl;
  link.click();
}

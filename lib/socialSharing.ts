'use client';

// Social sharing utilities

export interface ShareContent {
  title: string;
  text: string;
  url?: string;
  imageUrl?: string;
}

// Check if Web Share API is available
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

// Check if clipboard API is available
export function canCopy(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}

// Native share (mobile-friendly)
export async function nativeShare(content: ShareContent): Promise<boolean> {
  if (!canShare()) return false;

  try {
    await navigator.share({
      title: content.title,
      text: content.text,
      url: content.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error
    console.log('Share cancelled or failed:', error);
    return false;
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!canCopy()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

// Share to Twitter/X
export function shareToTwitter(content: ShareContent): void {
  const text = encodeURIComponent(content.text);
  const url = content.url ? `&url=${encodeURIComponent(content.url)}` : '';
  window.open(
    `https://twitter.com/intent/tweet?text=${text}${url}`,
    '_blank',
    'width=550,height=420'
  );
}

// Share to Facebook
export function shareToFacebook(content: ShareContent): void {
  const url = content.url ? encodeURIComponent(content.url) : encodeURIComponent(window.location.href);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank',
    'width=550,height=420'
  );
}

// Share to WhatsApp
export function shareToWhatsApp(content: ShareContent): void {
  const text = encodeURIComponent(`${content.text}${content.url ? `\n${content.url}` : ''}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Share to Telegram
export function shareToTelegram(content: ShareContent): void {
  const url = content.url ? encodeURIComponent(content.url) : '';
  const text = encodeURIComponent(content.text);
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

// Share via SMS (mobile)
export function shareViaSMS(content: ShareContent): void {
  const body = encodeURIComponent(`${content.text}${content.url ? `\n${content.url}` : ''}`);
  window.open(`sms:?body=${body}`);
}

// Share via Email
export function shareViaEmail(content: ShareContent): void {
  const subject = encodeURIComponent(content.title);
  const body = encodeURIComponent(`${content.text}${content.url ? `\n\n${content.url}` : ''}`);
  window.open(`mailto:?subject=${subject}&body=${body}`);
}

// Get base URL for sharing
export function getShareUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

// Generate share content for different scenarios
export function generateWinShare(tokensWon: number, handDescription: string): ShareContent {
  return {
    title: 'I just won at GUTS!',
    text: `Just won ${tokensWon} tokens with ${handDescription} in GUTS! Come play with me! 🎰🔥`,
    url: getShareUrl(),
  };
}

export function generateAchievementShare(achievementName: string): ShareContent {
  return {
    title: 'Achievement Unlocked!',
    text: `I just unlocked "${achievementName}" in GUTS! 🏆✨`,
    url: getShareUrl(),
  };
}

export function generateTournamentShare(position: number, tournamentName: string, prize: number): ShareContent {
  const positionText = position === 1 ? '1st' : position === 2 ? '2nd' : position === 3 ? '3rd' : `${position}th`;
  return {
    title: `Finished ${positionText} in ${tournamentName}!`,
    text: `I placed ${positionText} in ${tournamentName} and won ${prize} tokens! 🏆`,
    url: `${getShareUrl()}/tournaments`,
  };
}

export function generateReferralShare(referralCode: string, bonusTokens: number = 50): ShareContent {
  return {
    title: 'Join me on GUTS!',
    text: `Join GUTS and use my referral code ${referralCode} to get ${bonusTokens} free tokens! 🎁`,
    url: `${getShareUrl()}?ref=${referralCode}`,
  };
}

export function generateLeaderboardShare(rank: number, category: string): ShareContent {
  return {
    title: 'Check out my rank!',
    text: `I'm ranked #${rank} in ${category} on GUTS! Can you beat me? 🏅`,
    url: `${getShareUrl()}/leaderboard`,
  };
}

// Generic share function that tries native first, then fallback
export async function share(
  content: ShareContent,
  fallback: 'copy' | 'twitter' | 'facebook' | 'whatsapp' = 'copy'
): Promise<{ success: boolean; method: string }> {
  // Try native share first
  if (canShare()) {
    const success = await nativeShare(content);
    if (success) return { success: true, method: 'native' };
  }

  // Fallback
  switch (fallback) {
    case 'twitter':
      shareToTwitter(content);
      return { success: true, method: 'twitter' };
    case 'facebook':
      shareToFacebook(content);
      return { success: true, method: 'facebook' };
    case 'whatsapp':
      shareToWhatsApp(content);
      return { success: true, method: 'whatsapp' };
    case 'copy':
    default:
      const copied = await copyToClipboard(
        `${content.text}${content.url ? `\n${content.url}` : ''}`
      );
      return { success: copied, method: 'copy' };
  }
}

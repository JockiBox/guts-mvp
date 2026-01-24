'use client';

// Modern, pleasant game sounds using Web Audio API
// All sounds are synthesized - no external files needed

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Master volume (0-1)
let masterVolume = 0.3;

export function setMasterVolume(volume: number) {
  masterVolume = Math.max(0, Math.min(1, volume));
}

export function getMasterVolume(): number {
  return masterVolume;
}

// Check if sounds are enabled
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('guts_sound_enabled', enabled ? 'true' : 'false');
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('guts_sound_enabled');
    if (stored !== null) {
      soundEnabled = stored === 'true';
    }
  }
  return soundEnabled;
}

// Soft click - for buttons and UI interactions
export function playClick() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.1 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Silently fail if audio not available
  }
}

// Card flip sound - soft whoosh
export function playCardFlip() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();

    // White noise burst for "whoosh" effect
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  } catch (e) {}
}

// Countdown beep - soft, musical tones
export function playCountdown(number: number) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Higher pitch for lower numbers (more urgent)
    const freq = number === 1 ? 880 : number === 2 ? 660 : 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'sine';

    const duration = number === 1 ? 0.15 : 0.1;
    gain.gain.setValueAtTime(0.12 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Hold decision - confident, upward tone
export function playHold() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.15 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

// Drop decision - soft, downward tone
export function playDrop() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.1 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

// Win celebration - pleasant rising arpeggio
export function playWin() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 - major chord arpeggio

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + i * 0.08;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12 * masterVolume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  } catch (e) {}
}

// Lose sound - soft descending tone
export function playLose() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // Minor third interval descending
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.3);
    osc.type = 'sine';

    osc2.frequency.setValueAtTime(480, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0.08 * masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// Ghost appear - eerie but pleasant whoosh
export function playGhostAppear() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);

    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.3);
    osc.type = 'sine';

    osc2.frequency.setValueAtTime(277, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(415, ctx.currentTime + 0.3);
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1 * masterVolume, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// Six-Nine reveal - special celebratory sound
export function playSixNine() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    // Magical ascending sparkle
    const notes = [392, 494, 587, 784, 988, 1175]; // G4, B4, D5, G5, B5, D6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + i * 0.06;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1 * masterVolume, startTime + 0.02);
      gain.gain.setValueAtTime(0.1 * masterVolume, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });

    // Add a shimmer effect
    setTimeout(() => {
      if (!isSoundEnabled()) return;
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      lfo.connect(lfoGain);
      lfoGain.connect(shimmer.frequency);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmer.frequency.setValueAtTime(1568, ctx.currentTime); // G6
      shimmer.type = 'sine';

      lfo.frequency.setValueAtTime(12, ctx.currentTime);
      lfoGain.gain.setValueAtTime(50, ctx.currentTime);

      shimmerGain.gain.setValueAtTime(0.06 * masterVolume, ctx.currentTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      lfo.start(ctx.currentTime);
      shimmer.start(ctx.currentTime);
      lfo.stop(ctx.currentTime + 0.6);
      shimmer.stop(ctx.currentTime + 0.6);
    }, 300);
  } catch (e) {}
}

// Tokens/chips sound - subtle clink
export function playTokens() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();

    // Multiple quick metallic taps
    [0, 0.03, 0.07].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + delay;
      const freq = 2000 + Math.random() * 500;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + 0.05);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.05 * masterVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.start(startTime);
      osc.stop(startTime + 0.05);
    });
  } catch (e) {}
}

// New round start - gentle attention-getting chime
export function playNewRound() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // Perfect fifth interval
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.type = 'sine';

    osc2.frequency.setValueAtTime(660, ctx.currentTime);
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1 * masterVolume, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.1 * masterVolume, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

// Reveal start - anticipation building
export function playRevealStart() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);

    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06 * masterVolume, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

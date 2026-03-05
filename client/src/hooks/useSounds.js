import { useRef, useCallback, useEffect } from 'react';

let sharedCtx = null;

function getCtx() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

// Unlock audio on first user interaction
function unlockAudio() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  // Play a silent buffer to unlock
  const buf = ctx.createBuffer(1, 1, 22050);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
}

// Auto-unlock on first click anywhere
if (typeof window !== 'undefined') {
  const unlock = () => {
    unlockAudio();
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('click', unlock);
  window.addEventListener('keydown', unlock);
  window.addEventListener('touchstart', unlock);
}

export function useSounds() {

  // Short click tick
  const playClick = useCallback(() => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.07);
    } catch (e) { console.warn('playClick error:', e); }
  }, []);

  // Success chime — 3 ascending notes
  const playSuccess = useCallback(() => {
    try {
      const ac = getCtx();
      [523, 659, 784].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    } catch (e) { console.warn('playSuccess error:', e); }
  }, []);

  // Task complete — satisfying pop + chime
  const playComplete = useCallback(() => {
    try {
      const ac = getCtx();

      // Low pop
      const osc1 = ac.createOscillator();
      const gain1 = ac.createGain();
      osc1.connect(gain1);
      gain1.connect(ac.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, ac.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.06);
      gain1.gain.setValueAtTime(0.2, ac.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
      osc1.start(ac.currentTime);
      osc1.stop(ac.currentTime + 0.22);

      // High sparkle
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.connect(gain2);
      gain2.connect(ac.destination);
      osc2.type = 'sine';
      osc2.frequency.value = 1400;
      gain2.gain.setValueAtTime(0.08, ac.currentTime + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
      osc2.start(ac.currentTime + 0.05);
      osc2.stop(ac.currentTime + 0.32);

      // Chime
      const osc3 = ac.createOscillator();
      const gain3 = ac.createGain();
      osc3.connect(gain3);
      gain3.connect(ac.destination);
      osc3.type = 'sine';
      osc3.frequency.value = 880;
      gain3.gain.setValueAtTime(0.1, ac.currentTime + 0.1);
      gain3.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
      osc3.start(ac.currentTime + 0.1);
      osc3.stop(ac.currentTime + 0.52);
    } catch (e) { console.warn('playComplete error:', e); }
  }, []);

  // Delete — low thud
  const playDelete = useCallback(() => {
    try {
      const ac = getCtx();

      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.18);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.24);

      // Second thud layer
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.connect(gain2);
      gain2.connect(ac.destination);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(80, ac.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(30, ac.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.08, ac.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
      osc2.start(ac.currentTime);
      osc2.stop(ac.currentTime + 0.18);
    } catch (e) { console.warn('playDelete error:', e); }
  }, []);

  // AI thinking — ascending arpeggio
  const playAI = useCallback(() => {
    try {
      const ac = getCtx();
      [300, 400, 500, 650, 800, 1000].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    } catch (e) { console.warn('playAI error:', e); }
  }, []);

  // Drag drop — woosh
  const playDrop = useCallback(() => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.2);
    } catch (e) { console.warn('playDrop error:', e); }
  }, []);

  // Notification ping — two notes
  const playNotify = useCallback(() => {
    try {
      const ac = getCtx();
      [880, 1100].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ac.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.38);
      });
    } catch (e) { console.warn('playNotify error:', e); }
  }, []);

  // Modal open — soft swoosh up
  const playOpen = useCallback(() => {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.07, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.2);
    } catch (e) { console.warn('playOpen error:', e); }
  }, []);

  return {
    playClick,
    playSuccess,
    playComplete,
    playDelete,
    playAI,
    playDrop,
    playNotify,
    playOpen,
  };
}

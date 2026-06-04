// Helper to play short, synthesized sound effects using the Web Audio API.
// All sounds are designed to be extremely soft, low-volume, non-intrusive, and very short.

let audioCtx: AudioContext | null = null;
let isMutedGlobal = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const setMuted = (muted: boolean) => {
  isMutedGlobal = muted;
  try {
    localStorage.setItem("html5_audio_muted", muted ? "true" : "false");
  } catch (e) {}
};

export const getMuted = (): boolean => {
  try {
    const saved = localStorage.getItem("html5_audio_muted");
    if (saved) return saved === "true";
  } catch (e) {}
  return isMutedGlobal;
};

/**
 * Plays a soft, short synthesized sound
 * @param type 'success' | 'incorrect' | 'audit' | 'ding'
 */
export function playSound(type: 'success' | 'incorrect' | 'audit' | 'ding') {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  if (type === 'success') {
    // 100% Quiz score or complete success: Three brief sweet notes (C5, E5, G5) with very low volume
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + index * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.04, now + index * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.22);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.25);
    });
  } else if (type === 'incorrect') {
    // A soft down-beep, short and non-harsh (E4 -> C4)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.12); // C4
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'audit') {
    // Futuristic shiny chime for successful audit - sparkling, brief dual-tones with sine waves
    const freqs = [587.33, 880.00]; // D5, A5
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.05);
      
      gainNode.gain.setValueAtTime(0, now + index * 0.05);
      gainNode.gain.linearRampToValueAtTime(0.03, now + index * 0.05 + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.05 + 0.2);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + index * 0.05);
      osc.stop(now + index * 0.05 + 0.25);
    });
  } else if (type === 'ding') {
    // Very quick and gentle single ding
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(659.25, now); // E5
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

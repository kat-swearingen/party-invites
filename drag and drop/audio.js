/**
 * Web Audio API Sound Generator for Party Portal
 * Pure synthesized audio — no external mp3 files or network requests required!
 */

const SoundEngine = (function() {
  let ctx = null;
  let muted = false;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function isMuted() {
    return muted;
  }

  function setMuted(val) {
    muted = val;
    localStorage.setItem('mystery_audio_muted', muted ? '1' : '0');
    return muted;
  }

  function toggleMute() {
    return setMuted(!muted);
  }

  // Initial mute check
  if (localStorage.getItem('mystery_audio_muted') === '1') {
    muted = true;
  }

  /**
   * Wax Seal Break Sound (Crackle + snap + paper rustle)
   */
  function playSealBreak() {
    if (muted) return;
    try {
      const c = getContext();
      if (!c) return;
      const t = c.currentTime;

      // 1. Sharp Snap
      const snapOsc = c.createOscillator();
      const snapGain = c.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(480, t);
      snapOsc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
      snapGain.gain.setValueAtTime(0.4, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      snapOsc.connect(snapGain);
      snapGain.connect(c.destination);
      snapOsc.start(t);
      snapOsc.stop(t + 0.13);

      // 2. Paper rustle noise
      const bufferSize = c.sampleRate * 0.25;
      const noiseBuffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = c.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(1.5, t);

      const noiseGain = c.createGain();
      noiseGain.gain.setValueAtTime(0.25, t + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(c.destination);

      noise.start(t + 0.02);
      noise.stop(t + 0.28);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Deep confidential stamp thud
   */
  function playStamp() {
    if (muted) return;
    try {
      const c = getContext();
      if (!c) return;
      const t = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.2);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Eerie mystery chime / tension sting (revealing secret identity)
   */
  function playMysteryChime() {
    if (muted) return;
    try {
      const c = getContext();
      if (!c) return;
      const t = c.currentTime;

      // Dark diminished/minor chord (D3, F3, Ab3, D4)
      const freqs = [146.83, 174.61, 207.65, 293.66, 440.0];
      freqs.forEach((freq, idx) => {
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        const startTime = t + idx * 0.06;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18 / freqs.length, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(c.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.85);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Vintage typewriter keystroke
   */
  function playTypewriter() {
    if (muted) return;
    try {
      const c = getContext();
      if (!c) return;
      const t = c.currentTime;

      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Dramatic clock chime / bell
   */
  function playClockChime() {
    if (muted) return;
    try {
      const c = getContext();
      if (!c) return;
      const t = c.currentTime;

      const freqs = [330, 660, 990];
      freqs.forEach((f, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.2 / (i + 1), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t);
        osc.stop(t + 2.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  return {
    isMuted,
    setMuted,
    toggleMute,
    playSealBreak,
    playStamp,
    playMysteryChime,
    playTypewriter,
    playClockChime,
    init: getContext
  };
})();

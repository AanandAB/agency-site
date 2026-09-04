// Web Audio API Synthesizer for high-tech micro-interactions
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('ab_audio_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('ab_audio_muted', this.muted);
    if (!this.muted) {
      this.init();
      this.playChirp();
    }
    return this.muted;
  }

  playHover() {
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playClick() {
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playChirp() {
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.05);
      osc.frequency.linearRampToValueAtTime(1600, now + 0.1);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(now + 0.12);
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudio();
window.addEventListener('click', () => {
  if (!window.cyberAudio.initialized) {
    window.cyberAudio.init();
  }
}, { once: true });

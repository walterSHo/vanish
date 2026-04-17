import { t } from './i18n.js';

// ─── AUDIO ENGINE ─────────────────────────────────────────────────────────────
let audioCtx = null;
let soundEnabled = true;
let audioUnlocked = false;
let musicEnabled = true;
let musicStarted = false;
let musicEl = null;
let musicPreloadEl = null;
let musicFadeTimer = null;
let musicTrackIndex = 0;
let musicPausedAt = 0;
let musicTransitioning = false;
const MUSIC_VOLUME = 0.12;
const MUSIC_FADE_MS = 1100;
const MUSIC_END_FADE_WINDOW = 1.35;
const MUSIC_PLAYLIST = [
  'assets/audio/Light-Years_v001.mp3',
  'assets/audio/Trouble-On-Mercury.mp3',
  'assets/audio/Night-Winds.mp3',
  'assets/audio/Factory-On-Mercury.mp3',
  'assets/audio/Retro-Sci-Fi-Planet.mp3',
  'assets/audio/Cold-Moon.mp3',
];

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function normalizeTrackIndex(index) {
  const len = MUSIC_PLAYLIST.length || 1;
  return ((index % len) + len) % len;
}

function getMusicElement() {
  if (!musicEl) {
    musicEl = new Audio();
    musicEl.preload = 'auto';
    musicEl.loop = false;
    musicEl.volume = 0;
    musicEl.setAttribute('playsinline', '');
    musicEl.addEventListener('ended', () => {
      if (!musicEnabled || !musicStarted || musicTransitioning) return;
      transitionToTrack(musicTrackIndex + 1);
    });
    musicEl.addEventListener('timeupdate', () => {
      if (!musicEnabled || !musicStarted || musicTransitioning) return;
      if (!Number.isFinite(musicEl.duration) || musicEl.duration <= 0) return;
      const remaining = musicEl.duration - musicEl.currentTime;
      if (remaining <= MUSIC_END_FADE_WINDOW) transitionToTrack(musicTrackIndex + 1);
    });
  }
  return musicEl;
}

function getMusicPreloadElement() {
  if (!musicPreloadEl) {
    musicPreloadEl = new Audio();
    musicPreloadEl.preload = 'auto';
    musicPreloadEl.setAttribute('playsinline', '');
  }
  return musicPreloadEl;
}

// Unlock audio on first user interaction (required by mobile/Telegram webview)
function unlockAudio() {
  if (audioUnlocked) return;
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    audioUnlocked = true;
  } catch(e) {}
}
document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown',     unlockAudio, { once: true });

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('icon-sound-on').style.display  = soundEnabled ? '' : 'none';
  document.getElementById('icon-sound-off').style.display = soundEnabled ? 'none' : '';
  document.getElementById('btn-sound').style.opacity = soundEnabled ? '1' : '0.4';
}

function setMusicButtonState() {
  const onIcon = document.getElementById('icon-music-on');
  const offIcon = document.getElementById('icon-music-off');
  const btn = document.getElementById('btn-music');
  const setupBtn = document.getElementById('btn-setup-music');
  const setupState = document.getElementById('setup-music-state');
  if (onIcon) onIcon.style.display = musicEnabled ? '' : 'none';
  if (offIcon) offIcon.style.display = musicEnabled ? 'none' : '';
  if (btn) btn.style.opacity = musicEnabled ? '1' : '0.4';
  if (setupBtn) setupBtn.classList.toggle('is-off', !musicEnabled);
  if (setupState) {
    const nextState = musicEnabled ? (typeof t === 'function' ? t().musicOn : 'ON') : (typeof t === 'function' ? t().musicOff : 'OFF');
    setupState.textContent = nextState;
  }
}

function clearMusicFade() {
  if (musicFadeTimer !== null) {
    clearInterval(musicFadeTimer);
    musicFadeTimer = null;
  }
}

function fadeMusicTo(targetVolume, duration, onDone) {
  const el = getMusicElement();
  clearMusicFade();
  const from = Number.isFinite(el.volume) ? el.volume : 0;
  const to = Math.max(0, Math.min(MUSIC_VOLUME, targetVolume));
  if (duration <= 0 || Math.abs(from - to) < 0.001) {
    el.volume = to;
    if (onDone) onDone();
    return;
  }
  const start = performance.now();
  musicFadeTimer = setInterval(() => {
    const progress = Math.min(1, (performance.now() - start) / duration);
    el.volume = from + (to - from) * progress;
    if (progress >= 1) {
      clearMusicFade();
      el.volume = to;
      if (onDone) onDone();
    }
  }, 40);
}

function preloadUpcomingTrack() {
  if (!MUSIC_PLAYLIST.length) return;
  const preloadEl = getMusicPreloadElement();
  const nextSrc = MUSIC_PLAYLIST[normalizeTrackIndex(musicTrackIndex + 1)];
  if (!preloadEl.src.endsWith(nextSrc)) {
    preloadEl.src = nextSrc;
    preloadEl.load();
  }
}

function setTrackSource(index, startAt = 0) {
  const el = getMusicElement();
  const nextIndex = normalizeTrackIndex(index);
  const nextSrc = MUSIC_PLAYLIST[nextIndex];
  musicTrackIndex = nextIndex;
  const applyStartAt = () => {
    if (startAt > 0) {
      try {
        el.currentTime = startAt;
      } catch (e) {}
    }
  };

  if (!el.src.endsWith(nextSrc)) {
    el.src = nextSrc;
    el.load();
    if (startAt > 0) {
      el.addEventListener('loadedmetadata', applyStartAt, { once: true });
    }
    return;
  }

  applyStartAt();
}

function playTrack(index, startAt = 0) {
  if (!musicEnabled || !audioUnlocked || !MUSIC_PLAYLIST.length) return;
  const el = getMusicElement();
  setTrackSource(index, startAt);
  el.volume = 0;
  const playAttempt = el.play();
  const onStart = () => {
    musicStarted = true;
    musicPausedAt = 0;
    preloadUpcomingTrack();
    fadeMusicTo(MUSIC_VOLUME, MUSIC_FADE_MS, () => {
      musicTransitioning = false;
    });
  };
  const onFail = () => {
    musicStarted = false;
    musicTransitioning = false;
  };

  if (playAttempt && typeof playAttempt.then === 'function') {
    playAttempt.then(onStart).catch(onFail);
  } else {
    onStart();
  }
}

function transitionToTrack(index) {
  if (!musicEnabled || !audioUnlocked || musicTransitioning) return;
  musicTransitioning = true;
  fadeMusicTo(0, MUSIC_FADE_MS, () => {
    const el = getMusicElement();
    try { el.pause(); } catch (e) {}
    playTrack(index, 0);
  });
}

function stopMusic(preservePosition = true) {
  clearMusicFade();
  const el = musicEl;
  if (el) {
    if (preservePosition) {
      musicPausedAt = el.currentTime || 0;
    } else {
      musicPausedAt = 0;
      musicTrackIndex = 0;
    }
    try { el.pause(); } catch (e) {}
    el.volume = 0;
  }
  musicStarted = false;
  musicTransitioning = false;
}

function startMusic() {
  if (!musicEnabled || !audioUnlocked || musicStarted || musicTransitioning || !MUSIC_PLAYLIST.length) return;
  musicTransitioning = true;
  playTrack(musicTrackIndex, musicPausedAt);
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  setMusicButtonState();
  if (!musicEnabled) {
    if (musicStarted || musicTransitioning) {
      musicTransitioning = true;
      fadeMusicTo(0, Math.min(700, MUSIC_FADE_MS), () => {
        stopMusic(true);
      });
    } else {
      stopMusic(true);
    }
    return;
  }
  ensureMusicFromUserGesture();
}

function ensureMusicFromUserGesture() {
  unlockAudio();
  if (!musicEnabled) return;
  startMusic();
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function createOutputChain(ctx, opts = {}) {
  const output = ctx.createGain();
  output.gain.value = 1;
  let tail = output;

  if (opts.filterType) {
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType;
    filter.frequency.value = opts.filterFreq || 1200;
    if (opts.filterQ) filter.Q.value = opts.filterQ;
    tail.connect(filter);
    tail = filter;
  }

  if (typeof opts.pan === 'number' && typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    panner.pan.value = opts.pan;
    tail.connect(panner);
    tail = panner;
  }

  tail.connect(ctx.destination);
  return output;
}

function playVoice(opts = {}) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const {
      type = 'sine',
      freq = 440,
      freq2,
      duration = 0.12,
      gain = 0.14,
      attack = 0.004,
      decay = duration,
      pan,
      filterType,
      filterFreq,
      filterQ,
      detune = 0,
      drift = 0,
    } = opts;

    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const output = createOutputChain(ctx, { pan, filterType, filterFreq, filterQ });

    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), ctx.currentTime);
    osc.detune.setValueAtTime(detune + rand(-6, 6), ctx.currentTime);
    if (freq2) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq2), ctx.currentTime + duration);
    }
    if (drift) {
      osc.detune.linearRampToValueAtTime(detune + drift, ctx.currentTime + duration);
    }

    amp.gain.setValueAtTime(0.0001, ctx.currentTime);
    amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + Math.max(attack + 0.02, decay));

    osc.connect(amp);
    amp.connect(output);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.03);
  } catch (e) {}
}

function playNoiseBurst(opts = {}) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const {
      duration = 0.08,
      gain = 0.05,
      attack = 0.002,
      decay = duration,
      pan,
      filterType = 'bandpass',
      filterFreq = 1600,
      filterQ = 1.2,
    } = opts;

    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const src = ctx.createBufferSource();
    const amp = ctx.createGain();
    const output = createOutputChain(ctx, { pan, filterType, filterFreq, filterQ });

    src.buffer = buffer;
    amp.gain.setValueAtTime(0.0001, ctx.currentTime);
    amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + Math.max(attack + 0.02, decay));

    src.connect(amp);
    amp.connect(output);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + duration + 0.02);
  } catch (e) {}
}

const SFX = {
  place() {
    playVoice({
      type: 'triangle',
      freq: rand(500, 540),
      freq2: rand(250, 290),
      duration: 0.1,
      gain: 0.08,
      attack: 0.002,
      decay: 0.085,
      filterType: 'lowpass',
      filterFreq: 2200,
      drift: -18,
    });
  },
  vanish() {
    playVoice({
      type: 'triangle',
      freq: rand(320, 360),
      freq2: rand(95, 125),
      duration: 0.22,
      gain: 0.065,
      attack: 0.004,
      decay: 0.18,
      filterType: 'lowpass',
      filterFreq: 1400,
      drift: -34,
    });
    playVoice({
      type: 'sine',
      freq: rand(180, 220),
      freq2: rand(70, 90),
      duration: 0.18,
      gain: 0.045,
      attack: 0.002,
      decay: 0.14,
      filterType: 'bandpass',
      filterFreq: 900,
      filterQ: 1.1,
      pan: rand(-0.12, 0.12),
    });
    playNoiseBurst({
      duration: 0.07,
      gain: 0.022,
      filterType: 'highpass',
      filterFreq: 2100,
      filterQ: 0.8,
      pan: rand(-0.18, 0.18),
    });
  },
  win() {
    playVoice({
      type: 'triangle',
      freq: 660,
      duration: 0.18,
      gain: 0.1,
      attack: 0.004,
      decay: 0.14,
      filterType: 'lowpass',
      filterFreq: 2600,
    });
    setTimeout(() => playVoice({
      type: 'triangle',
      freq: 880,
      duration: 0.22,
      gain: 0.085,
      attack: 0.004,
      decay: 0.18,
      filterType: 'lowpass',
      filterFreq: 2800,
    }), 130);
  },
  lose() {
    playVoice({
      type: 'triangle',
      freq: rand(320, 350),
      freq2: rand(170, 195),
      duration: 0.22,
      gain: 0.072,
      attack: 0.003,
      decay: 0.18,
      filterType: 'lowpass',
      filterFreq: 1500,
      drift: -22,
    });
    setTimeout(() => playVoice({
      type: 'sine',
      freq: rand(180, 205),
      freq2: rand(92, 108),
      duration: 0.24,
      gain: 0.05,
      attack: 0.003,
      decay: 0.2,
      filterType: 'bandpass',
      filterFreq: 820,
      filterQ: 1.2,
      pan: rand(-0.14, 0.14),
      drift: -18,
    }), 40);
    setTimeout(() => playNoiseBurst({
      duration: 0.08,
      gain: 0.016,
      filterType: 'bandpass',
      filterFreq: 1450,
      filterQ: 1.8,
      pan: rand(-0.12, 0.12),
    }), 22);
  },
  comboLight() {
    playVoice({
      type: 'triangle',
      freq: rand(400, 430),
      freq2: rand(520, 560),
      duration: 0.09,
      gain: 0.055,
      attack: 0.002,
      decay: 0.075,
      filterType: 'bandpass',
      filterFreq: 1800,
      filterQ: 1.4,
      pan: rand(-0.12, 0.12),
    });
    setTimeout(() => playVoice({
      type: 'sine',
      freq: rand(640, 700),
      duration: 0.08,
      gain: 0.04,
      attack: 0.002,
      decay: 0.06,
      filterType: 'lowpass',
      filterFreq: 2400,
      pan: rand(-0.15, 0.15),
    }), 42);
  },
  comboMedium() {
    playVoice({
      type: 'triangle',
      freq: rand(300, 330),
      freq2: rand(520, 560),
      duration: 0.12,
      gain: 0.065,
      attack: 0.002,
      decay: 0.1,
      filterType: 'bandpass',
      filterFreq: 1650,
      filterQ: 1.6,
      pan: -0.12,
    });
    playVoice({
      type: 'sawtooth',
      freq: rand(470, 520),
      freq2: rand(680, 760),
      duration: 0.14,
      gain: 0.038,
      attack: 0.002,
      decay: 0.11,
      filterType: 'lowpass',
      filterFreq: 1500,
      pan: 0.14,
      drift: 10,
    });
    setTimeout(() => playNoiseBurst({
      duration: 0.08,
      gain: 0.022,
      filterType: 'bandpass',
      filterFreq: 2400,
      filterQ: 2.2,
      pan: rand(-0.18, 0.18),
    }), 26);
  },
  comboHeavy() {
    playVoice({
      type: 'triangle',
      freq: rand(220, 250),
      freq2: rand(460, 520),
      duration: 0.14,
      gain: 0.075,
      attack: 0.002,
      decay: 0.12,
      filterType: 'bandpass',
      filterFreq: 1350,
      filterQ: 1.8,
      pan: -0.18,
      drift: 18,
    });
    playVoice({
      type: 'sawtooth',
      freq: rand(430, 470),
      freq2: rand(820, 900),
      duration: 0.16,
      gain: 0.05,
      attack: 0.002,
      decay: 0.13,
      filterType: 'lowpass',
      filterFreq: 1700,
      pan: 0.2,
      drift: 24,
    });
    setTimeout(() => playVoice({
      type: 'sine',
      freq: rand(720, 780),
      duration: 0.1,
      gain: 0.03,
      attack: 0.001,
      decay: 0.08,
      filterType: 'highpass',
      filterFreq: 2000,
      pan: rand(-0.22, 0.22),
    }), 36);
    setTimeout(() => playNoiseBurst({
      duration: 0.1,
      gain: 0.026,
      filterType: 'bandpass',
      filterFreq: 2600,
      filterQ: 2.4,
      pan: rand(-0.22, 0.22),
    }), 24);
  },
  combo(level = 'light') {
    if (level === 'heavy') return this.comboHeavy();
    if (level === 'medium') return this.comboMedium();
    return this.comboLight();
  },
  click() {
    playVoice({
      type: 'triangle',
      freq: rand(860, 920),
      freq2: rand(1120, 1180),
      duration: 0.045,
      gain: 0.034,
      attack: 0.001,
      decay: 0.03,
      filterType: 'highpass',
      filterFreq: 1400,
      filterQ: 1.3,
      pan: rand(-0.08, 0.08),
    });
    setTimeout(() => playNoiseBurst({
      duration: 0.025,
      gain: 0.012,
      filterType: 'bandpass',
      filterFreq: 3200,
      filterQ: 3.5,
      pan: rand(-0.1, 0.1),
    }), 8);
  },
};

setMusicButtonState();

export {
  SFX,
  toggleSound,
  toggleMusic,
  ensureMusicFromUserGesture,
  setMusicButtonState,
};

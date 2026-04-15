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

function playTone(opts) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const { type = 'sine', freq = 440, freq2, duration = 0.12,
            gain = 0.18, attack = 0.005, decay = 0.04,
            freqDecay = false } = opts;

    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.connect(amp);
    amp.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freq2 && freqDecay) {
      osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + duration);
    }

    amp.gain.setValueAtTime(0, ctx.currentTime);
    amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + attack + decay);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch(e) {}
}

const SFX = {
  place() {
    playTone({ type: 'triangle', freq: 520, freq2: 260, duration: 0.1,
               gain: 0.14, attack: 0.003, decay: 0.08, freqDecay: true });
  },
  vanish() {
    playTone({ type: 'sine', freq: 340, freq2: 120, duration: 0.22,
               gain: 0.12, attack: 0.005, decay: 0.18, freqDecay: true });
  },
  win() {
    playTone({ type: 'triangle', freq: 660, duration: 0.18, gain: 0.18, attack: 0.005, decay: 0.14 });
    setTimeout(() => playTone({ type: 'triangle', freq: 880, duration: 0.22,
                                gain: 0.15, attack: 0.005, decay: 0.18 }), 130);
  },
  combo() {
    playTone({ type: 'square', freq: 420, duration: 0.08, gain: 0.1, attack: 0.003, decay: 0.07 });
    setTimeout(() => playTone({ type: 'square', freq: 560, duration: 0.1,
                                gain: 0.1, attack: 0.003, decay: 0.08 }), 70);
  },
  click() {
    playTone({ type: 'triangle', freq: 700, duration: 0.06, gain: 0.1, attack: 0.002, decay: 0.04 });
  },
};

setMusicButtonState();

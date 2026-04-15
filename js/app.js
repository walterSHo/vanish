// ─── SVG SYMBOLS ─────────────────────────────────────────────────────────────
function cipherSVG(color, size) {
  color = color || '#00eeff';
  size  = size  || 60;
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" aria-hidden="true">
    <polygon points="25,6 28,14 27,29 28,46 25,54 35,54 32,46 33,31 32,14 35,6"
      fill="${color}22" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
    <polygon points="6,25 14,28 29,27 46,28 54,25 54,35 46,32 31,33 14,32 6,35"
      fill="${color}22" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="24" y="24" width="12" height="12" fill="${color}33" stroke="${color}" stroke-width="1.8"/>
    <line x1="27" y1="18" x2="33" y2="16" stroke="${color}" stroke-width="1.1" stroke-dasharray="2 2" opacity="0.7"/>
    <line x1="27" y1="42" x2="33" y2="44" stroke="${color}" stroke-width="1.1" stroke-dasharray="2 2" opacity="0.7"/>
    <line x1="18" y1="27" x2="16" y2="33" stroke="${color}" stroke-width="1.1" stroke-dasharray="2 2" opacity="0.7"/>
    <line x1="42" y1="27" x2="44" y2="33" stroke="${color}" stroke-width="1.1" stroke-dasharray="2 2" opacity="0.7"/>
    <circle cx="10" cy="10" r="1.2" fill="${color}" opacity="0.35"/>
    <circle cx="50" cy="10" r="1.0" fill="${color}" opacity="0.3"/>
    <circle cx="10" cy="50" r="1.0" fill="${color}" opacity="0.3"/>
    <circle cx="50" cy="50" r="1.2" fill="${color}" opacity="0.35"/>
    <circle cx="30" cy="30" r="2.5" fill="${color}" opacity="0.9"/>
  </svg>`;
}

function wraithSVG(color, size) {
  color = color || '#ff00cc';
  size  = size  || 60;
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" aria-hidden="true">
    <path d="M30,6 C40,5 52,14 54,26 C56,38 48,52 36,55 C24,58 10,50 7,38 C4,26 10,10 22,7 Z"
      fill="${color}1a" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M30,14 C36,13 44,19 45,28 C46,37 40,45 32,46 C24,47 16,41 16,32 C16,22 24,15 30,14 Z"
      fill="${color}2a" stroke="${color}" stroke-width="1.4"/>
    <circle cx="50" cy="13" r="1.8" fill="${color}" opacity="0.6"/>
    <circle cx="55" cy="20" r="1.1" fill="${color}" opacity="0.4"/>
    <circle cx="48" cy="8"  r="1.3" fill="${color}" opacity="0.5"/>
    <circle cx="10" cy="18" r="1.5" fill="${color}" opacity="0.5"/>
    <circle cx="6"  cy="28" r="1.0" fill="${color}" opacity="0.35"/>
    <circle cx="14" cy="50" r="1.4" fill="${color}" opacity="0.45"/>
    <circle cx="42" cy="54" r="1.2" fill="${color}" opacity="0.4"/>
    <circle cx="30" cy="30" r="4"   fill="${color}" opacity="0.55"/>
  </svg>`;
}

// ─── DAILY CHALLENGE ENGINE ──────────────────────────────────────────────────
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function dateSeed(dateStr) {
  const n = parseInt(dateStr.replace(/-/g, ''), 10);
  return n ^ 0xDEAD0000;
}

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function seededOrder(length, rng) {
  const items = Array.from({ length }, (_, i) => i);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function generateDailyChallenge(dateStr) {
  const rng = mulberry32(dateSeed(dateStr));
  const preBoard = Array(9).fill(null);
  const cellOrder = seededOrder(9, rng);
  const profile = Math.floor(rng() * 4);
  const preMarks = { cipher: [], wraith: [] };
  const layoutsByProfile = [
    { placements: [], moveLimitOptions: [5, 6, 7], objective: 'dailyObjMoves' },
    { placements: ['cipher', 'wraith'], moveLimitOptions: [null], objective: 'dailyObjBoard' },
    { placements: ['cipher', 'wraith', 'cipher'], moveLimitOptions: [5, 6, 7], objective: 'dailyObjBoth' },
    { placements: ['cipher', 'wraith', 'cipher', 'wraith'], moveLimitOptions: [6, 7, 8], objective: 'dailyObjBoth' },
  ];
  const layout = layoutsByProfile[profile];

  layout.placements.forEach((faction, i) => {
    const cell = cellOrder[i];
    preBoard[cell] = faction;
    preMarks[faction].push(cell);
  });

  const moveLimit = layout.moveLimitOptions[Math.floor(rng() * layout.moveLimitOptions.length)];
  let objective;
  if (moveLimit && layout.placements.length > 0) objective = 'dailyObjBoth';
  else if (moveLimit)                             objective = 'dailyObjMoves';
  else if (layout.placements.length > 0)         objective = 'dailyObjBoard';
  else                                           objective = layout.objective || 'dailyObjWin';

  return {
    preBoard,
    objective,
    moveLimit,
    dateStr,
    seed: dateSeed(dateStr),
  };
}

let dailyChallenge = null;
let dailyMovesLeft = null;
let dailyTimerStartedAt = null;
let dailyElapsedMs = 0;
let dailyTimerInterval = null;

function formatDailyTime(ms, includeTenths = false) {
  const safeMs = Math.max(0, ms || 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  if (!includeTenths) return `${minutes}:${seconds}`;
  const tenths = Math.floor((safeMs % 1000) / 100);
  return `${minutes}:${seconds}.${tenths}`;
}

function updateDailyResultText(mode = 'win') {
  const el = document.getElementById('daily-result');
  if (!el) return;
  if (gameMode !== 'daily') {
    el.textContent = '';
    return;
  }
  const template = mode === 'fail' ? t().dailyResultFail : t().dailyResultWin;
  el.textContent = template.replace('{time}', formatDailyTime(dailyElapsedMs, true));
}

function stopDailyTimer(resultMode = null) {
  if (dailyTimerInterval !== null) {
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
  }
  if (dailyTimerStartedAt !== null) {
    dailyElapsedMs = Date.now() - dailyTimerStartedAt;
    dailyTimerStartedAt = null;
  }
  updateDailyMovesUI();
  if (resultMode) updateDailyResultText(resultMode);
}

function startDailyTimer() {
  if (gameMode !== 'daily' || dailyTimerStartedAt !== null || gameOver) return;
  dailyTimerStartedAt = Date.now() - dailyElapsedMs;
  updateDailyMovesUI();
  dailyTimerInterval = setInterval(() => {
    if (dailyTimerStartedAt === null) return;
    dailyElapsedMs = Date.now() - dailyTimerStartedAt;
    updateDailyMovesUI();
  }, 100);
}

function openDailyInfo() {
  const dateStr = todayString();
  dailyChallenge = generateDailyChallenge(dateStr);
  document.getElementById('daily-date-label').textContent = dateStr;
  const dc = dailyChallenge;
  let objText = t().dailyObjectives[dc.objective] || dc.objective;
  if (dc.moveLimit) objText = objText.replace('{n}', dc.moveLimit);
  document.getElementById('daily-objective').textContent = objText;
  const prev = document.getElementById('daily-board-preview');
  prev.innerHTML = '';
  dc.preBoard.forEach(cell => {
    const d = document.createElement('div');
    d.className = 'daily-preview-cell';
    if (cell === 'cipher') d.innerHTML = cipherSVG('#00eeff', 18);
    else if (cell === 'wraith') d.innerHTML = wraithSVG('#ff00cc', 18);
    prev.appendChild(d);
  });
  document.getElementById('daily-info-overlay').classList.add('show');
  document.getElementById('btn-daily-start').focus();
}

function closeDailyInfo() {
  document.getElementById('daily-info-overlay').classList.remove('show');
  selectMode('duel');
}

function closeDailyInfoOnBackdrop(e) {
  if (e.target === document.getElementById('daily-info-overlay')) closeDailyInfo();
}

function startDailyChallenge() {
  cancelBotMove();
  if (typeof ensureMusicFromUserGesture === 'function') ensureMusicFromUserGesture();
  stopDailyTimer();
  dailyElapsedMs = 0;
  document.getElementById('daily-info-overlay').classList.remove('show');
  document.getElementById('setup-overlay').classList.remove('show');
  const raw1 = document.getElementById('input-p1').value.trim();
  currentUserName = raw1 || t().defaultP1;
  matchRoundTotal = 1;
  roundsCompleted = 0;
  score = { cipher: 0, wraith: 0 };
  updateScoreDisplay();
  resetRankedState();
  comboText.classList.remove('show');
  clearTimeout(comboTimer);
  initState();
  assignDailySides();
  histStrip.innerHTML = '';
  buildBoard();
  const dc = dailyChallenge;
  const preMarks = { cipher: [], wraith: [] };
  dc.preBoard.forEach((owner, idx) => {
    if (!owner) return;
    board[idx] = owner;
    preMarks[owner].push(idx);
    const cell = cellEl(idx);
    cell.classList.add('occupied');
    const wrap = document.createElement('div');
    wrap.className = 'cell-mark';
    wrap.innerHTML = owner === 'cipher' ? cipherSVG('#00eeff') : wraithSVG('#ff00cc');
    cell.insertBefore(wrap, cell.firstChild);
  });
  marks = {
    cipher: preMarks.cipher.map(c => ({ cell: c, histId: 0 })),
    wraith: preMarks.wraith.map(c => ({ cell: c, histId: 0 })),
  };
  dailyMovesLeft = dc.moveLimit;
  updatePanelNames();
  updateRankUI();
  updateModeBadge();
  updateAgainButtonLabel();
  render();
  clearAllGhosts();
  updateDailyMovesUI();
  updateDailyResultText();
  statusEl.textContent = t().movesFirst(playerDisplayName('cipher'));
  statusEl.style.color  = 'var(--cipher)';
  cellEl(0).focus();
}

function updateDailyMovesUI() {
  const el = document.getElementById('mode-badge');
  if (!el || gameMode !== 'daily') return;
  const parts = [t().dailyBadge, t().dailyTime.replace('{time}', formatDailyTime(dailyElapsedMs))];
  if (dailyMovesLeft !== null) parts.push(t().dailyMovesLeft.replace('{n}', dailyMovesLeft));
  el.textContent = parts.join(' · ');
  el.style.display = 'block';
}

// ─── GAME MODE ───────────────────────────────────────────────────────────────
let gameMode = 'duel';
let opponentType = 'bot';
const AVAILABLE_MODES = {
  bot: ['duel', 'daily'],
  local: ['duel', 'ranked'],
};
let currentUserName = 'Игрок 1';
let localSecondName = 'Игрок 2';
let currentUserFaction = 'cipher';
let botControlledFaction = 'wraith';
let selectedRoundCount = 1;
let selectedBotDifficulty = 'xo';
let matchRoundTotal = 1;
let roundsCompleted = 0;

function validModesForOpponent(type) {
  return AVAILABLE_MODES[type] || AVAILABLE_MODES.bot;
}

function oppositeFaction(faction) {
  return faction === 'cipher' ? 'wraith' : 'cipher';
}

function randomFaction() {
  return Math.random() < 0.5 ? 'cipher' : 'wraith';
}

function isLocalSeriesMatch() {
  return opponentType === 'local' && matchRoundTotal > 1;
}

function hasMoreRounds() {
  return opponentType === 'local' && roundsCompleted < matchRoundTotal;
}

function currentRoundNumber() {
  return Math.min(roundsCompleted + 1, matchRoundTotal);
}

function syncAvailableModes() {
  const validModes = validModesForOpponent(opponentType);
  const roundsRow = document.getElementById('setup-rounds-row');
  const botDifficultyRow = document.getElementById('setup-bot-difficulty-row');
  if (roundsRow) roundsRow.style.display = opponentType === 'local' ? '' : 'none';
  if (botDifficultyRow) botDifficultyRow.style.display = opponentType === 'bot' && gameMode === 'duel' ? '' : 'none';
  ['duel', 'ranked', 'daily'].forEach(mode => {
    const btn = document.getElementById(`btn-mode-${mode}`);
    if (!btn) return;
    const enabled = validModes.includes(mode);
    btn.disabled = !enabled;
    btn.classList.toggle('disabled', !enabled);
    btn.setAttribute('aria-disabled', String(!enabled));
  });

  if (!validModes.includes(gameMode)) {
    selectMode(validModes[0]);
  } else {
    ['duel', 'ranked', 'daily'].forEach(mode => {
      document.getElementById(`btn-mode-${mode}`).classList.toggle('active', mode === gameMode);
    });
  }
}

function updateSetupNicknameFields() {
  const rowP2 = document.getElementById('setup-row-p2');
  const labelP1 = document.getElementById('label-p1');
  const inp1 = document.getElementById('input-p1');
  const inp2 = document.getElementById('input-p2');
  const isLocal = opponentType === 'local';

  if (rowP2) rowP2.style.display = isLocal ? '' : 'none';
  if (labelP1) labelP1.textContent = isLocal ? t().setupLabelP1 : t().setupLabelC;
  if (inp1) inp1.placeholder = t().defaultP1;
  if (inp2) inp2.placeholder = t().defaultP2;
}

function syncRankedLockState() {
  const lockRow = document.getElementById('setup-ranked-lock-row');
  const startBtn = document.getElementById('btn-setup-start');
  if (lockRow) lockRow.style.display = gameMode === 'ranked' ? '' : 'none';
  if (!startBtn) return;
  const locked = gameMode === 'ranked';
  startBtn.classList.toggle('is-disabled', locked);
  startBtn.disabled = locked;
  startBtn.setAttribute('aria-disabled', String(locked));
  startBtn.textContent = locked ? t().comingSoon : t().setupStart;
}

function selectBotDifficulty(level) {
  selectedBotDifficulty = level;
  ['baby', 'norm', 'xo'].forEach(name => {
    const btn = document.getElementById(`btn-bot-${name}`);
    if (btn) btn.classList.toggle('active', name === level);
  });
}

function selectRoundCount(count) {
  selectedRoundCount = count;
  [1, 3, 5].forEach(n => {
    const btn = document.getElementById(`btn-rounds-${n}`);
    if (btn) btn.classList.toggle('active', n === count);
  });
}

function selectMode(m) {
  if (!validModesForOpponent(opponentType).includes(m)) return;
  gameMode = m;
  document.getElementById('btn-mode-duel').classList.toggle('active', m === 'duel');
  document.getElementById('btn-mode-ranked').classList.toggle('active', m === 'ranked');
  document.getElementById('btn-mode-daily').classList.toggle('active', m === 'daily');
  syncRankedLockState();
}

function selectOpponentType(type) {
  opponentType = type;
  document.getElementById('btn-opponent-bot').classList.toggle('active', type === 'bot');
  document.getElementById('btn-opponent-local').classList.toggle('active', type === 'local');
  syncAvailableModes();
  updateSetupNicknameFields();
}

// ─── RANK SYSTEM (session-only) ───────────────────────────────────────────────
const RANKS = [
  { name: 'ROOKIE',  threshold: 3 },
  { name: 'TAGGER',  threshold: 5 },
  { name: 'WRITER',  threshold: 7 },
  { name: 'PHANTOM', threshold: 10 },
  { name: 'LEGEND',  threshold: Infinity },
];

let rankedState = {
  cipher: { rankIndex: 0, points: 0 },
  wraith: { rankIndex: 0, points: 0 },
};

function resetRankedState() {
  rankedState = {
    cipher: { rankIndex: 0, points: 0 },
    wraith: { rankIndex: 0, points: 0 },
  };
}

function awardRankedPoint(faction) {
  const rs = rankedState[faction];
  rs.points++;
  const rank = RANKS[rs.rankIndex];
  if (rs.points >= rank.threshold && rs.rankIndex < RANKS.length - 1) {
    rs.rankIndex++;
    rs.points = 0;
    return true;
  }
  return false;
}

function updateRankUI() {
  ['cipher', 'wraith'].forEach(p => {
    const el = document.getElementById(`panel-rank-${p}`);
    if (!el) return;
    if (gameMode !== 'ranked') { el.textContent = ''; return; }
    const rs = rankedState[p];
    const rank = RANKS[rs.rankIndex];
    const pips = rank.threshold === Infinity
      ? '\u2605'.repeat(rs.points % 5 || 5)
      : '\u25a0'.repeat(rs.points) + '\u25a1'.repeat(Math.max(0, rank.threshold - rs.points));
    el.innerHTML = `<span class="rank-name">${rank.name}</span><span class="rank-pips">${pips}</span>`;
  });
}

function updateModeBadge() {
  const el = document.getElementById('mode-badge');
  if (!el) return;
  if (opponentType === 'local' && matchRoundTotal > 1) {
    const roundText = t().roundBadge
      .replace('{current}', currentRoundNumber())
      .replace('{total}', matchRoundTotal);
    el.textContent = gameMode === 'ranked'
      ? `${t().rankedBadge} · ${roundText}`
      : roundText;
    el.style.display = 'block';
  } else if (gameMode === 'ranked') {
    el.textContent = t().rankedBadge;
    el.style.display = 'block';
  } else if (gameMode === 'daily') {
    updateDailyMovesUI();
  } else {
    el.style.display = 'none';
  }
}

// ─── NICKNAMES ────────────────────────────────────────────────────────────────
let nicknames = { cipher: 'Игрок 1', wraith: 'Игрок 2' };

function playerDisplayName(faction) {
  return nicknames[faction];
}

function defaultOpponentName() {
  if (gameMode === 'daily') return t().dailyCpuName;
  return opponentType === 'bot' ? t().opponentBot : localSecondName;
}

function syncLocalizedOpponentName() {
  nicknames[currentUserFaction] = currentUserName;
  if (gameOver || historyCounter > 0) {
    nicknames[oppositeFaction(currentUserFaction)] = defaultOpponentName();
  }
  updatePanelNames();
}

function assignSidesForMatch() {
  currentUserFaction = randomFaction();
  botControlledFaction = opponentType === 'bot' ? oppositeFaction(currentUserFaction) : null;
  nicknames = { cipher: '', wraith: '' };
  nicknames[currentUserFaction] = currentUserName;
  nicknames[oppositeFaction(currentUserFaction)] = defaultOpponentName();
}

function assignDailySides() {
  currentUserFaction = 'cipher';
  botControlledFaction = 'wraith';
  nicknames = { cipher: '', wraith: '' };
  nicknames[currentUserFaction] = currentUserName;
  nicknames[oppositeFaction(currentUserFaction)] = defaultOpponentName();
}

function updateAgainButtonLabel() {
  const btn = document.getElementById('btn-again');
  if (!btn) return;
  btn.textContent = hasMoreRounds() ? t().nextRound : t().playAgain;
}

function updatePanelNames() {
  const nickC = document.getElementById('panel-nick-cipher');
  const nickW = document.getElementById('panel-nick-wraith');
  nickC.textContent = nicknames.cipher;
  nickW.textContent = nicknames.wraith;
  nickC.classList.toggle('tg-user', tgUser !== null && currentUserFaction === 'cipher');
  nickW.classList.toggle('tg-user', tgUser !== null && currentUserFaction === 'wraith');
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const WIN_LINES  = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
const COL_LABELS = ['A','B','C'];
const ROW_LABELS = ['1','2','3'];
const MAX_MARKS  = 3;

// ─── STATE ───────────────────────────────────────────────────────────────────
let board, marks, currentPlayer, isAnimating, gameOver, score,
    historyCounter, historyData, ownMarkVanishedThisTurn;
let botMoveTimer = null;

function initState() {
  board                   = Array(9).fill(null);
  marks                   = { cipher: [], wraith: [] };
  currentPlayer           = 'cipher';
  isAnimating             = false;
  gameOver                = false;
  historyCounter          = 0;
  historyData             = [];
  ownMarkVanishedThisTurn = false;
}

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const boardEl    = document.getElementById('board');
const statusEl   = document.getElementById('status-msg');
const winOverlay = document.getElementById('win-overlay');
const winTitle   = document.getElementById('win-title');
const winSym     = document.getElementById('win-faction-symbol');
const scoreDisp  = document.getElementById('score-display');
const histStrip  = document.getElementById('history-strip');
const scoreCEl   = document.getElementById('score-c');
const scoreWEl   = document.getElementById('score-w');
const comboText  = document.getElementById('combo-text');

const cellLabel = i => COL_LABELS[i % 3] + ROW_LABELS[Math.floor(i / 3)];
const cellEl    = i => boardEl.children[i];

let comboTimer = null;
let userNavigating = false; // true once the user has interacted with keyboard nav

// Track keyboard-initiated focus so ghost only shows on deliberate nav, not programmatic .focus()
document.addEventListener('keydown', () => { userNavigating = true; }, { passive: true });
document.addEventListener('pointerdown', () => { userNavigating = false; }, { passive: true });

// ─── COMBO BANNER ─────────────────────────────────────────────────────────────
function showCombo(msg, color) {
  clearTimeout(comboTimer);
  comboText.textContent      = msg;
  comboText.style.color      = color || '#fff';
  comboText.style.textShadow = `0 0 12px ${color || '#fff'}88`;
  comboText.classList.add('show');
  SFX.combo();
  comboTimer = setTimeout(() => comboText.classList.remove('show'), 1800);
}

// ─── BUILD BOARD ─────────────────────────────────────────────────────────────
function buildBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const div = document.createElement('div');
    div.className     = 'cell';
    div.dataset.index = i;
    div.tabIndex      = 0;
    div.setAttribute('role', 'gridcell');
    div.addEventListener('click', () => onCellClick(i));
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCellClick(i); }
      const row = Math.floor(i / 3);
      const col = i % 3;
      let next = -1;
      if (e.key === 'ArrowRight') next = row * 3 + (col + 1) % 3;
      if (e.key === 'ArrowLeft')  next = row * 3 + (col + 2) % 3;
      if (e.key === 'ArrowDown')  next = ((row + 1) % 3) * 3 + col;
      if (e.key === 'ArrowUp')    next = ((row + 2) % 3) * 3 + col;
      if (next >= 0) { e.preventDefault(); cellEl(next).focus(); }
    });
    div.addEventListener('mouseenter', () => showGhost(div, i));
    div.addEventListener('mouseleave', () => hideGhost(div));
    div.addEventListener('focus',      () => { if (userNavigating) showGhost(div, i); });
    div.addEventListener('blur',       () => hideGhost(div));
    boardEl.appendChild(div);
  }
}

// ─── GHOST PREVIEW ────────────────────────────────────────────────────────────
function showGhost(div, i) {
  if (gameOver || isAnimating || board[i] !== null || isBotTurn()) return;
  let ghost = div.querySelector('.cell-ghost');
  if (!ghost) {
    ghost = document.createElement('div');
    ghost.className = 'cell-ghost';
    div.appendChild(ghost);
  }
  ghost.innerHTML = currentPlayer === 'cipher' ? cipherSVG('#00eeff') : wraithSVG('#ff00cc');
  ghost.classList.add('show');
}

function hideGhost(div) {
  const ghost = div.querySelector('.cell-ghost');
  if (ghost) ghost.classList.remove('show');
}

function clearAllGhosts() {
  boardEl.querySelectorAll('.cell-ghost').forEach(g => g.classList.remove('show'));
}

// ─── ARIA LABELS ─────────────────────────────────────────────────────────────
function updateAriaLabels() {
  for (let i = 0; i < 9; i++) {
    const owner = board[i];
    const label = cellLabel(i);
    const state = owner ? owner.toUpperCase() : 'empty';
    cellEl(i).setAttribute('aria-label',   `${label} ${state}`);
    cellEl(i).setAttribute('aria-pressed', owner ? 'true' : 'false');
  }
}

// ─── PANEL SYMBOLS ───────────────────────────────────────────────────────────
function injectPanelSymbols() {
  document.getElementById('sym-cipher-panel').innerHTML = cipherSVG('#00eeff', 52);
  document.getElementById('sym-wraith-panel').innerHTML = wraithSVG('#ff00cc', 52);
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
const warnDivs = {};

function render() {
  Object.keys(warnDivs).forEach(k => {
    const d = warnDivs[k];
    if (d && d.parentNode) d.parentNode.removeChild(d);
    delete warnDivs[k];
  });

  for (let i = 0; i < 9; i++) {
    const cell  = cellEl(i);
    const owner = board[i];
    cell.classList.remove('win-cipher', 'win-wraith');
    if (owner && !cell.querySelector('.cell-mark')) {
      cell.classList.add('occupied');
      const wrap = document.createElement('div');
      wrap.className = 'cell-mark';
      wrap.innerHTML = owner === 'cipher' ? cipherSVG('#00eeff') : wraithSVG('#ff00cc');
      cell.insertBefore(wrap, cell.firstChild);
    }
  }

  ['cipher', 'wraith'].forEach(p => {
    if (marks[p].length === MAX_MARKS) {
      const oldest = marks[p][0].cell;
      const cell   = cellEl(oldest);
      const d1 = document.createElement('div');
      d1.className = 'warn-brackets';
      d1.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;';
      cell.appendChild(d1);
      const d2 = document.createElement('div');
      d2.className = 'warn-corner-rb';
      d2.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;';
      cell.appendChild(d2);
      warnDivs[`${p}-a`] = d1;
      warnDivs[`${p}-b`] = d2;
    }
  });

  ['cipher', 'wraith'].forEach(p => {
    const dotsEl = document.getElementById(`dots-${p}`);
    Array.from(dotsEl.children).forEach((dot, i) => {
      dot.classList.toggle('active', i < marks[p].length);
    });
  });

  const prevC = document.getElementById('panel-cipher').classList.contains('active-player');
  const prevW = document.getElementById('panel-wraith').classList.contains('active-player');
  const nowC  = currentPlayer === 'cipher';
  const nowW  = currentPlayer === 'wraith';

  function setPanel(id, active, wasActive) {
    const el = document.getElementById(id);
    if (active && !wasActive) {
      el.classList.remove('active-player');
      void el.offsetWidth;
      el.classList.add('active-player');
    } else if (!active) {
      el.classList.remove('active-player');
    }
  }
  setPanel('panel-cipher', nowC, prevC);
  setPanel('panel-wraith', nowW, prevW);

  if (!gameOver) {
    statusEl.textContent = t().placeYourMark(playerDisplayName(currentPlayer));
    statusEl.style.color = currentPlayer === 'cipher' ? 'var(--cipher)' : 'var(--wraith)';
  }

  updateAriaLabels();
}

// ─── HISTORY ─────────────────────────────────────────────────────────────────
function addHistory(player, cellIndex) {
  const id  = ++historyCounter;
  const lbl = cellLabel(cellIndex);
  historyData.push({ id, player, cell: cellIndex, label: lbl, erased: false });
  const span = document.createElement('span');
  span.className   = `hist-item ${player}`;
  span.id          = `hist-${id}`;
  span.textContent = `${player === 'cipher' ? 'C' : 'W'} ${lbl}`;
  histStrip.appendChild(span);
  histStrip.scrollLeft = histStrip.scrollWidth;
  return id;
}

function markHistoryErased(histId) {
  const el = document.getElementById(`hist-${histId}`);
  if (el) el.classList.add('erased');
}

// ─── WIN CHECK ────────────────────────────────────────────────────────────────
function checkWin(player) {
  return WIN_LINES.find(line => line.every(idx => board[idx] === player)) || null;
}

function checkWinOnBoard(boardState, player) {
  return WIN_LINES.find(line => line.every(idx => boardState[idx] === player)) || null;
}

function isBotMatch() {
  return botControlledFaction !== null;
}

function isBotTurn() {
  return isBotMatch() && currentPlayer === botControlledFaction && !gameOver;
}

function cancelBotMove() {
  if (botMoveTimer !== null) {
    clearTimeout(botMoveTimer);
    botMoveTimer = null;
  }
}

function simulateMove(player, index) {
  if (board[index] !== null) return null;
  const boardState = board.slice();
  const marksState = {
    cipher: marks.cipher.map(mark => ({ cell: mark.cell })),
    wraith: marks.wraith.map(mark => ({ cell: mark.cell })),
  };

  if (marksState[player].length === MAX_MARKS) {
    const oldest = marksState[player].shift();
    boardState[oldest.cell] = null;
  }

  boardState[index] = player;
  marksState[player].push({ cell: index });

  let winner = checkWinOnBoard(boardState, player) ? player : null;
  if (!winner) {
    const opp = player === 'cipher' ? 'wraith' : 'cipher';
    if (checkWinOnBoard(boardState, opp)) winner = opp;
  }

  return { boardState, marksState, winner };
}

function chooseBotMove() {
  const bestMove = chooseBestBotMove();
  if (selectedBotDifficulty === 'xo') return bestMove;
  if (selectedBotDifficulty === 'norm') return chooseNormBotMove(bestMove);
  return chooseBabyBotMove(bestMove);
}

function chooseBestBotMove() {
  const emptyCells = board.map((owner, idx) => owner === null ? idx : -1).filter(idx => idx >= 0);
  if (!emptyCells.length) return null;

  const winningMove = emptyCells.find(idx => simulateMove(botControlledFaction, idx)?.winner === botControlledFaction);
  if (winningMove !== undefined) return winningMove;

  const blockingMove = emptyCells.find(idx => simulateMove(currentUserFaction, idx)?.winner === currentUserFaction);
  if (blockingMove !== undefined) return blockingMove;

  if (board[4] === null) return 4;

  const cornerMove = [0, 2, 6, 8].find(idx => board[idx] === null);
  if (cornerMove !== undefined) return cornerMove;

  return emptyCells[0];
}

function chooseSimpleBotMove() {
  const emptyCells = board.map((owner, idx) => owner === null ? idx : -1).filter(idx => idx >= 0);
  if (!emptyCells.length) return null;
  if (board[4] === null) return 4;
  return emptyCells[0];
}

function chooseImperfectBotMove(bestMove, smartChance) {
  if (bestMove === null) return null;
  if (Math.random() < smartChance) return bestMove;
  const simpleMove = chooseSimpleBotMove();
  return simpleMove !== null ? simpleMove : bestMove;
}

function chooseNormBotMove(bestMove) {
  return chooseImperfectBotMove(bestMove, 0.75);
}

function chooseBabyBotMove(bestMove) {
  return chooseImperfectBotMove(bestMove, 0.35);
}

function scheduleBotMove() {
  cancelBotMove();
  if (!isBotTurn() || isAnimating || gameOver) return;
  clearAllGhosts();
  botMoveTimer = setTimeout(() => {
    botMoveTimer = null;
    if (!isBotTurn() || isAnimating || gameOver) return;
    const move = chooseBotMove();
    if (move !== null) onCellClick(move, 'bot');
  }, 420);
}

// ─── THREAT ANALYSIS ─────────────────────────────────────────────────────────
function getWinThreats(player) {
  const threats = new Set();
  WIN_LINES.forEach(line => {
    const owned   = line.filter(i => board[i] === player);
    const empties = line.filter(i => board[i] === null);
    if (owned.length === 2 && empties.length === 1) threats.add(empties[0]);
  });
  return threats;
}

// ─── COMBO DETECTION ─────────────────────────────────────────────────────────
function detectCombos(player, placedCell, oppThreatsBeforeMove) {
  const opp = player === 'cipher' ? 'wraith' : 'cipher';
  if (ownMarkVanishedThisTurn) {
    showCombo(t().combos.fadewin, player === 'cipher' ? 'var(--cipher)' : 'var(--wraith)');
    return;
  }
  if (oppThreatsBeforeMove.has(placedCell)) {
    const stillThreats = getWinThreats(opp);
    if (stillThreats.size < oppThreatsBeforeMove.size) {
      showCombo(t().combos.intercept, '#ff6a00');
      return;
    }
  }
  const myThreats = getWinThreats(player).size;
  if (myThreats >= 2) {
    showCombo(t().combos.doubleThreat, player === 'cipher' ? 'var(--cipher)' : 'var(--wraith)');
  }
}

// ─── HIGHLIGHT WIN ────────────────────────────────────────────────────────────
function highlightWin(line, player) {
  line.forEach(idx => {
    cellEl(idx).className = `cell occupied win-${player}`;
  });
}

// ─── CELL CLICK / PLACEMENT ──────────────────────────────────────────────────
function onCellClick(index, source = 'human') {
  if (gameOver || isAnimating) return;
  if (source !== 'bot' && isBotTurn()) return;
  if (board[index] !== null) return;
  if (typeof ensureMusicFromUserGesture === 'function' && source !== 'bot') ensureMusicFromUserGesture();
  if (gameMode === 'daily' && source !== 'bot') startDailyTimer();

  isAnimating = true;
  const player = currentPlayer;
  ownMarkVanishedThisTurn = false;

  if (gameMode === 'daily' && player === 'cipher' && dailyMovesLeft !== null) {
    dailyMovesLeft--;
    updateDailyMovesUI();
  }

  const opp           = player === 'cipher' ? 'wraith' : 'cipher';
  const oppThreatsNow = getWinThreats(opp);
  hideGhost(cellEl(index));

  if (marks[player].length === MAX_MARKS) {
    ownMarkVanishedThisTurn = true;
    const oldest  = marks[player].shift();
    const vanCell = oldest.cell;
    board[vanCell] = null;
    markHistoryErased(oldest.histId);
    const oldCellEl = cellEl(vanCell);
    const markDiv   = oldCellEl.querySelector('.cell-mark');
    if (markDiv) markDiv.classList.add('vanishing');
    SFX.vanish();
    oldCellEl.querySelectorAll('.warn-brackets,.warn-corner-rb').forEach(d => d.remove());
    setTimeout(() => {
      oldCellEl.innerHTML = '';
      oldCellEl.className = 'cell';
      oldCellEl.tabIndex  = 0;
      placeNewMark(player, index, oppThreatsNow);
    }, 360);
  } else {
    placeNewMark(player, index, oppThreatsNow);
  }
}

function placeNewMark(player, index, oppThreatsBeforeMove) {
  board[index] = player;
  const histId = addHistory(player, index);
  marks[player].push({ cell: index, histId });

  const cell = cellEl(index);
  cell.classList.add('occupied');
  const wrap = document.createElement('div');
  wrap.className = 'cell-mark placed';
  wrap.innerHTML = player === 'cipher' ? cipherSVG('#00eeff') : wraithSVG('#ff00cc');
  cell.insertBefore(wrap, cell.firstChild);
  SFX.place();

  setTimeout(() => {
    isAnimating = false;

    let winLine = checkWin(player);
    let winner  = winLine ? player : null;
    if (!winner) {
      const opp = player === 'cipher' ? 'wraith' : 'cipher';
      const ol  = checkWin(opp);
      if (ol) { winLine = ol; winner = opp; }
    }

    render();

    if (winner) {
      highlightWin(winLine, winner);
      triggerWin(winner);
    } else {
      if (gameMode === 'daily' && player === 'cipher' && dailyMovesLeft !== null && dailyMovesLeft <= 0) {
        triggerDailyFail();
        return;
      }
      detectCombos(player, index, oppThreatsBeforeMove);
      currentPlayer = player === 'cipher' ? 'wraith' : 'cipher';
      render();
      if (isBotTurn()) scheduleBotMove();
    }
  }, 230);
}

// ─── WIN ─────────────────────────────────────────────────────────────────────
function triggerDailyFail() {
  cancelBotMove();
  stopDailyTimer('fail');
  gameOver = true;
  updateAgainButtonLabel();
  statusEl.textContent = t().dailyFailed;
  statusEl.style.color = 'var(--warn)';
  showCombo(t().dailyFailed, 'var(--warn)');
  setTimeout(() => {
    winTitle.textContent      = t().dailyFailed;
    winTitle.className        = '';
    winTitle.style.color      = 'var(--warn)';
    winTitle.style.textShadow = '0 0 14px #ff6a0088';
    document.getElementById('win-subtitle').textContent = t().dailyFailSub;
    winSym.innerHTML    = '';
    scoreDisp.innerHTML = '';
    updateDailyResultText('fail');
    winOverlay.classList.add('show');
    setTimeout(() => winOverlay.querySelector('.btn').focus(), 100);
  }, 800);
}

function triggerWin(winner) {
  cancelBotMove();
  if (gameMode === 'daily') stopDailyTimer('win');
  gameOver = true;
  roundsCompleted++;
  score[winner]++;
  updateScoreDisplay();
  SFX.win();
  updateModeBadge();
  updateAgainButtonLabel();

  let rankedUp = false;
  if (gameMode === 'ranked') {
    rankedUp = awardRankedPoint(winner);
    updateRankUI();
  }

  winTitle.textContent = t().wins(playerDisplayName(winner));
  winTitle.className   = `win-${winner}`;
  winTitle.style.color = '';
  winTitle.style.textShadow = '';
  document.getElementById('win-subtitle').textContent = t().winSub;
  winSym.innerHTML    = winner === 'cipher' ? cipherSVG('#00eeff', 100) : wraithSVG('#ff00cc', 100);
  winSym.style.filter = winner === 'cipher'
    ? 'drop-shadow(0 0 14px #00eeffaa)'
    : 'drop-shadow(0 0 14px #ff00ccaa)';

  scoreDisp.innerHTML =
    `<span class="score-c">${score.cipher}</span>` +
    `<span style="color:var(--muted)"> &mdash; </span>` +
    `<span class="score-w">${score.wraith}</span>`;
  if (gameMode === 'daily') updateDailyResultText('win');
  else document.getElementById('daily-result').textContent = '';

  statusEl.textContent = t().controlsGrid(playerDisplayName(winner));
  statusEl.style.color  = winner === 'cipher' ? 'var(--cipher)' : 'var(--wraith)';

  if (rankedUp) {
    const newRankName = RANKS[rankedState[winner].rankIndex].name;
    const color = winner === 'cipher' ? 'var(--cipher)' : 'var(--wraith)';
    showCombo(`${t().rankUp} ${newRankName}`, color);
    setTimeout(() => {
      winOverlay.classList.add('show');
      setTimeout(() => winOverlay.querySelector('.btn').focus(), 100);
    }, 600);
  } else {
    winOverlay.classList.add('show');
    setTimeout(() => winOverlay.querySelector('.btn').focus(), 100);
  }
}

function updateScoreDisplay() {
  scoreCEl.textContent = `C  ${score.cipher}`;
  scoreWEl.textContent = `${score.wraith}  W`;
}

// ─── RESTART ─────────────────────────────────────────────────────────────────
function restartGame() {
  cancelBotMove();
  stopDailyTimer();
  dailyElapsedMs = 0;
  winOverlay.classList.remove('show');
  comboText.classList.remove('show');
  clearTimeout(comboTimer);
  initState();
  histStrip.innerHTML = '';
  buildBoard();
  render();
  clearAllGhosts();
  updatePanelNames();
  updateRankUI();
  updateModeBadge();
  updateAgainButtonLabel();
  document.getElementById('daily-result').textContent = '';
  statusEl.textContent = t().movesFirst(playerDisplayName('cipher'));
  statusEl.style.color  = 'var(--cipher)';
  cellEl(0).focus();
  if (isBotTurn()) scheduleBotMove();
}

function handleAgainButton() {
  if (hasMoreRounds()) {
    restartGame();
    return;
  }
  openSetup();
}

// ─── SETUP MODAL ─────────────────────────────────────────────────────────────
function openSetup() {
  cancelBotMove();
  stopDailyTimer();
  winOverlay.classList.remove('show');
  document.getElementById('daily-result').textContent = '';
  const inp1 = document.getElementById('input-p1');
  const inp2 = document.getElementById('input-p2');
  inp1.value = currentUserName;
  if (inp2) inp2.value = localSecondName;
  document.getElementById('setup-overlay').classList.add('show');
  selectMode(gameMode);
  selectOpponentType(opponentType);
  selectBotDifficulty(selectedBotDifficulty);
  selectRoundCount(selectedRoundCount);
  syncRankedLockState();
  inp1.focus();
}

function startFromSetup() {
  cancelBotMove();
  if (typeof ensureMusicFromUserGesture === 'function') ensureMusicFromUserGesture();
  stopDailyTimer();
  dailyElapsedMs = 0;
  if (gameMode === 'ranked') {
    syncRankedLockState();
    return;
  }
  if (gameMode === 'daily') {
    document.getElementById('setup-overlay').classList.remove('show');
    openDailyInfo();
    return;
  }
  const inp1 = document.getElementById('input-p1');
  const inp2 = document.getElementById('input-p2');
  currentUserName = inp1.value.trim() || t().defaultP1;
  if (opponentType === 'local' && inp2) {
    localSecondName = inp2.value.trim() || t().defaultP2;
  }
  matchRoundTotal = opponentType === 'local' ? selectedRoundCount : 1;
  roundsCompleted = 0;
  resetRankedState();
  document.getElementById('setup-overlay').classList.remove('show');
  comboText.classList.remove('show');
  clearTimeout(comboTimer);
  score = { cipher: 0, wraith: 0 };
  updateScoreDisplay();
  initState();
  assignSidesForMatch();
  histStrip.innerHTML = '';
  buildBoard();
  render();
  clearAllGhosts();
  updatePanelNames();
  updateRankUI();
  updateModeBadge();
  updateAgainButtonLabel();
  document.getElementById('daily-result').textContent = '';
  statusEl.textContent = t().movesFirst(playerDisplayName('cipher'));
  statusEl.style.color  = 'var(--cipher)';
  cellEl(0).focus();
  if (isBotTurn()) scheduleBotMove();
}

// ─── RULES MODAL ─────────────────────────────────────────────────────────────
function openRules() {
  document.getElementById('rules-overlay').classList.add('show');
  document.getElementById('btn-rules-close').focus();
}

function closeRules() {
  document.getElementById('rules-overlay').classList.remove('show');
}

function closeRulesOnBackdrop(e) {
  if (e.target === document.getElementById('rules-overlay')) closeRules();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const menuControl = e.target.closest('.btn, .lang-btn, .mode-btn, .sound-btn, .setup-music-toggle, .setup-opponent-btn, .setup-bot-btn, .setup-round-btn');
  if (!menuControl) return;
  if (typeof ensureMusicFromUserGesture === 'function') ensureMusicFromUserGesture();
  SFX.click();
}, true);

score = { cipher: 0, wraith: 0 };
injectPanelSymbols();
initState();
buildBoard();
render();

tgUser = getTelegramUser();
if (tgUser) {
  const tgName = (tgUser.first_name || tgUser.username || '').trim().slice(0, 16);
  if (tgName) currentUserName = tgName;
}

nicknames.cipher = currentUserName;
updatePanelNames();
document.getElementById('input-p1').placeholder = t().defaultP1;
document.getElementById('input-p2').placeholder = t().defaultP2;
if (tgUser) {
  document.getElementById('input-p1').value = currentUserName;
}
document.getElementById('setup-overlay').classList.add('show');
selectMode(gameMode);
selectOpponentType(opponentType);
selectBotDifficulty(selectedBotDifficulty);
selectRoundCount(selectedRoundCount);
updateSetupNicknameFields();
updateAgainButtonLabel();
syncRankedLockState();
document.getElementById('input-p1').focus();

export const STORAGE_KEY = 'vanish-local-save';
export const STORAGE_VERSION = 1;
export const MATCH_HISTORY_LIMIT = 250;

const TITLE_RULES = [
  {
    key: 'merciless',
    source: 'career',
    matches: ctx => ctx.outcome === 'win' && ctx.stats.currentStreak >= 5,
  },
  {
    key: 'rhythmBreaker',
    source: 'match',
    matches: ctx => ctx.outcome === 'win' && ctx.entry.opponentType === 'bot' && ctx.entry.difficulty === 'xo',
  },
  {
    key: 'signalBinder',
    source: 'career',
    matches: ctx => ctx.outcome === 'win'
      && ctx.entry.playerSide === 'cipher'
      && ctx.stats.sidesPlayed.cipher >= 8
      && ctx.stats.sidesPlayed.cipher >= ctx.stats.sidesPlayed.wraith + 3,
  },
  {
    key: 'boardPhantom',
    source: 'career',
    matches: ctx => ctx.outcome === 'win'
      && ctx.entry.playerSide === 'wraith'
      && ctx.stats.sidesPlayed.wraith >= 8
      && ctx.stats.sidesPlayed.wraith >= ctx.stats.sidesPlayed.cipher + 3,
  },
  {
    key: 'challengeShade',
    source: 'career',
    matches: ctx => ctx.outcome === 'win'
      && ctx.entry.gameMode === 'daily'
      && ctx.matches.filter(match => match.outcome === 'win' && match.gameMode === 'daily').length >= 3,
  },
  {
    key: 'coldblooded',
    source: 'match',
    matches: ctx => ctx.outcome === 'win'
      && ((ctx.entry.durationMs > 0 && ctx.entry.durationMs <= 25000) || ctx.entry.statsContext.totalTurns <= 5),
  },
  {
    key: 'lastPulse',
    source: 'match',
    matches: ctx => ctx.outcome === 'win'
      && ctx.entry.statsContext.totalTurns >= 7
      && ctx.entry.durationMs <= 65000,
  },
  {
    key: 'silentHunter',
    source: 'match',
    matches: ctx => ctx.outcome === 'win'
      && (ctx.entry.durationMs >= 90000 || ctx.entry.statsContext.totalTurns >= 8),
  },
];

function safeParseJSON(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function resolveTitleText(key, titlesMap = {}) {
  return key ? (titlesMap[key] || '') : '';
}

export function cloneBoardState(state) {
  return Array.isArray(state) ? state.slice() : Array(9).fill(null);
}

export function cloneMarksState(state) {
  return {
    cipher: Array.isArray(state && state.cipher) ? state.cipher.map(mark => ({ cell: mark.cell, histId: mark.histId || 0 })) : [],
    wraith: Array.isArray(state && state.wraith) ? state.wraith.map(mark => ({ cell: mark.cell, histId: mark.histId || 0 })) : [],
  };
}

export function createDefaultPersistentProfile() {
  return {
    schemaVersion: STORAGE_VERSION,
    stats: {
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalDurationMs: 0,
      averageMatchDurationMs: 0,
      sidesPlayed: { cipher: 0, wraith: 0 },
      modesPlayed: { duel: 0, ranked: 0, daily: 0 },
      difficultiesPlayed: { baby: 0, norm: 0, xo: 0 },
      updatedAt: null,
    },
    titles: {
      unlocked: [],
      lastShownKey: null,
      updatedAt: null,
    },
    matches: [],
  };
}

function normalizeCounterMap(raw, keys) {
  return keys.reduce((acc, key) => {
    const value = Number(raw && raw[key]);
    acc[key] = Number.isFinite(value) && value >= 0 ? value : 0;
    return acc;
  }, {});
}

export function normalizePersistentProfile(raw) {
  const base = createDefaultPersistentProfile();
  if (!raw || typeof raw !== 'object') return base;

  const stats = raw.stats && typeof raw.stats === 'object' ? raw.stats : {};
  const totalMatches = Number(stats.totalMatches);
  const totalWins = Number(stats.totalWins);
  const totalLosses = Number(stats.totalLosses);
  const totalDurationMs = Number(stats.totalDurationMs);
  const currentStreak = Number(stats.currentStreak);
  const bestStreak = Number(stats.bestStreak);

  base.stats.totalMatches = Number.isFinite(totalMatches) && totalMatches >= 0 ? totalMatches : 0;
  base.stats.totalWins = Number.isFinite(totalWins) && totalWins >= 0 ? totalWins : 0;
  base.stats.totalLosses = Number.isFinite(totalLosses) && totalLosses >= 0 ? totalLosses : 0;
  base.stats.totalDurationMs = Number.isFinite(totalDurationMs) && totalDurationMs >= 0 ? totalDurationMs : 0;
  base.stats.currentStreak = Number.isFinite(currentStreak) && currentStreak >= 0 ? currentStreak : 0;
  base.stats.bestStreak = Number.isFinite(bestStreak) && bestStreak >= 0 ? bestStreak : 0;
  base.stats.sidesPlayed = normalizeCounterMap(stats.sidesPlayed, ['cipher', 'wraith']);
  base.stats.modesPlayed = normalizeCounterMap(stats.modesPlayed, ['duel', 'ranked', 'daily']);
  base.stats.difficultiesPlayed = normalizeCounterMap(stats.difficultiesPlayed, ['baby', 'norm', 'xo']);
  base.stats.updatedAt = typeof stats.updatedAt === 'string' ? stats.updatedAt : null;

  if (base.stats.totalMatches > 0) {
    base.stats.winRate = Number((base.stats.totalWins / base.stats.totalMatches).toFixed(4));
    base.stats.averageMatchDurationMs = Math.round(base.stats.totalDurationMs / base.stats.totalMatches);
  }

  base.matches = Array.isArray(raw.matches)
    ? raw.matches.filter(entry => entry && typeof entry === 'object').slice(0, MATCH_HISTORY_LIMIT)
    : [];

  const titles = raw.titles && typeof raw.titles === 'object' ? raw.titles : {};
  base.titles.unlocked = Array.isArray(titles.unlocked)
    ? titles.unlocked
        .filter(entry => entry && typeof entry === 'object' && typeof entry.key === 'string')
        .map(entry => ({
          key: entry.key,
          source: entry.source === 'career' ? 'career' : 'match',
          unlockedAt: typeof entry.unlockedAt === 'string' ? entry.unlockedAt : null,
          lastAwardedAt: typeof entry.lastAwardedAt === 'string' ? entry.lastAwardedAt : null,
        }))
    : [];
  base.titles.lastShownKey = typeof titles.lastShownKey === 'string' ? titles.lastShownKey : null;
  base.titles.updatedAt = typeof titles.updatedAt === 'string' ? titles.updatedAt : null;

  return base;
}

export function loadPersistentProfile(storage = window.localStorage, key = STORAGE_KEY) {
  if (!storage) return createDefaultPersistentProfile();
  const raw = safeParseJSON(storage.getItem(key));
  return normalizePersistentProfile(raw);
}

export function savePersistentProfile(profile, storage = window.localStorage, key = STORAGE_KEY) {
  if (!storage || !profile) return;
  try {
    storage.setItem(key, JSON.stringify(profile));
  } catch {
    // Keep gameplay unaffected if localStorage is unavailable or full.
  }
}

export function createMatchRecord({
  gameMode,
  opponentType,
  selectedBotDifficulty,
  currentUserFaction,
  currentUserName,
  nicknames,
  currentRoundNumber,
  matchRoundTotal,
  initialState,
  dailyChallenge,
  oppositeFaction,
  extra = {},
}) {
  return {
    id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    startedAt: new Date().toISOString(),
    gameMode,
    opponentType,
    botDifficulty: opponentType === 'bot' ? selectedBotDifficulty : null,
    playerSide: currentUserFaction,
    opponentSide: oppositeFaction(currentUserFaction),
    currentUserName,
    playerNames: {
      cipher: nicknames.cipher || '',
      wraith: nicknames.wraith || '',
    },
    round: {
      current: currentRoundNumber,
      total: matchRoundTotal,
    },
    initialState,
    daily: gameMode === 'daily' && dailyChallenge
      ? {
          date: dailyChallenge.dateStr,
          seed: dailyChallenge.seed,
          moveLimit: dailyChallenge.moveLimit,
          objective: dailyChallenge.objective,
          preBoard: cloneBoardState(dailyChallenge.preBoard),
        }
      : null,
    ...extra,
  };
}

export function createMatchHistoryEntry({
  matchRecord,
  outcome,
  winnerFaction = null,
  winnerName,
  playerSide,
  opponentSide,
  difficulty,
  currentUserName,
  currentRoundNumber,
  matchRoundTotal,
  finalState,
  historyData,
  score,
  resultSummaryState,
  matchElapsedMs,
  formatMatchTime,
}) {
  const nowIso = new Date().toISOString();
  const durationMs = Math.max(0, matchElapsedMs || 0);
  const turns = historyData.map((entry, idx) => ({
    turn: idx + 1,
    id: entry.id,
    player: entry.player,
    cell: entry.cell,
    label: entry.label,
    erased: Boolean(entry.erased),
    erasedOnTurn: entry.erasedOnTurn || null,
  }));

  return {
    schemaVersion: STORAGE_VERSION,
    id: matchRecord?.id || `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    savedAt: nowIso,
    startedAt: matchRecord?.startedAt || nowIso,
    gameMode: matchRecord?.gameMode || 'duel',
    opponentType: matchRecord?.opponentType || 'bot',
    difficulty,
    outcome,
    winnerFaction,
    winnerName: winnerFaction ? winnerName : null,
    playerSide,
    opponentSide,
    durationMs,
    durationText: formatMatchTime(durationMs),
    timestamp: nowIso,
    date: nowIso.slice(0, 10),
    round: matchRecord?.round || { current: currentRoundNumber, total: matchRoundTotal },
    playerNames: matchRecord?.playerNames || { cipher: '', wraith: '' },
    currentUserName,
    initialState: matchRecord?.initialState || finalState,
    finalState,
    turns,
    statsContext: {
      totalTurns: turns.length,
      score: { cipher: score.cipher, wraith: score.wraith },
      resultSummaryState,
    },
    daily: matchRecord?.daily || null,
    title: null,
  };
}

function unlockTitle(profile, key, source, timestamp) {
  const unlocked = profile.titles.unlocked;
  const existing = unlocked.find(entry => entry.key === key);
  if (existing) {
    existing.source = source === 'career' ? 'career' : existing.source;
    existing.lastAwardedAt = timestamp;
    return existing;
  }
  const record = {
    key,
    source: source === 'career' ? 'career' : 'match',
    unlockedAt: timestamp,
    lastAwardedAt: timestamp,
  };
  unlocked.push(record);
  return record;
}

function resolveFallbackTitle(profile, entry) {
  if (!profile || !profile.titles.unlocked.length) return '';
  const unlocked = profile.titles.unlocked.slice().sort((a, b) => {
    const aTime = Date.parse(a.lastAwardedAt || a.unlockedAt || 0);
    const bTime = Date.parse(b.lastAwardedAt || b.unlockedAt || 0);
    return bTime - aTime;
  });

  if (entry.playerSide === 'cipher' && unlocked.some(item => item.key === 'signalBinder')) return 'signalBinder';
  if (entry.playerSide === 'wraith' && unlocked.some(item => item.key === 'boardPhantom')) return 'boardPhantom';
  return unlocked[0]?.key || '';
}

function resolveEntryTitles(profile, entry, statsSnapshot, prospectiveMatches) {
  const context = {
    entry,
    outcome: entry.outcome,
    stats: statsSnapshot,
    matches: prospectiveMatches,
  };
  const qualified = TITLE_RULES.filter(rule => rule.matches(context));
  const selectedRule = qualified[0] || null;
  const selectedKey = selectedRule?.key || resolveFallbackTitle(profile, entry);
  const selectedSource = selectedRule?.source || (selectedKey ? 'identity' : null);
  return { qualified, selectedKey, selectedSource };
}

export function updateProfileWithCompletedMatch({
  profile,
  entry,
  currentUserFaction,
  gameMode,
  opponentType,
  selectedBotDifficulty,
}) {
  const nextProfile = normalizePersistentProfile(profile);
  const stats = nextProfile.stats;

  stats.totalMatches += 1;
  if (entry.outcome === 'win') {
    stats.totalWins += 1;
    stats.currentStreak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  } else {
    stats.totalLosses += 1;
    stats.currentStreak = 0;
  }
  stats.totalDurationMs += Math.max(0, entry.durationMs || 0);
  stats.averageMatchDurationMs = stats.totalMatches > 0
    ? Math.round(stats.totalDurationMs / stats.totalMatches)
    : 0;
  stats.winRate = stats.totalMatches > 0
    ? Number((stats.totalWins / stats.totalMatches).toFixed(4))
    : 0;
  if (stats.sidesPlayed[currentUserFaction] !== undefined) stats.sidesPlayed[currentUserFaction] += 1;
  if (stats.modesPlayed[gameMode] !== undefined) stats.modesPlayed[gameMode] += 1;
  if (opponentType === 'bot' && gameMode === 'duel' && stats.difficultiesPlayed[selectedBotDifficulty] !== undefined) {
    stats.difficultiesPlayed[selectedBotDifficulty] += 1;
  }
  stats.updatedAt = entry.savedAt;

  const prospectiveMatches = [entry, ...nextProfile.matches].slice(0, MATCH_HISTORY_LIMIT);
  const titleResolution = resolveEntryTitles(nextProfile, entry, stats, prospectiveMatches);
  titleResolution.qualified.forEach(rule => unlockTitle(nextProfile, rule.key, rule.source, entry.savedAt));
  entry.title = titleResolution.selectedKey
    ? { key: titleResolution.selectedKey, source: titleResolution.selectedSource }
    : null;

  nextProfile.matches.unshift(entry);
  if (nextProfile.matches.length > MATCH_HISTORY_LIMIT) {
    nextProfile.matches.length = MATCH_HISTORY_LIMIT;
  }
  nextProfile.titles.lastShownKey = titleResolution.selectedKey || nextProfile.titles.lastShownKey || null;
  nextProfile.titles.updatedAt = entry.savedAt;

  return { profile: nextProfile, entry };
}

// ─── I18N ─────────────────────────────────────────────────────────────────────
let lang = 'ru';

const T = {
  ru: {
    subtitle:      'метки гаснут \u2022 легенды остаются',
    movesFirst:    name => `${name} ХОДИТ ПЕРВЫМ`,
    placeYourMark: name => `${name} \u2014 ДЕЛАЙ ХОД`,
    controlsGrid:  name => `${name} ЗАХВАТЫВАЕТ ПОЛЕ`,
    wins:          name => `${name} ПОБЕДИЛ`,
    histLabel:     'история ходов',
    turnTag:       'ваш ход',
    restart:       'ЗАНОВО',
    playAgain:     'ЕЩЁ РАЗ',
    mainMenu:      'В МЕНЮ',
    rulesBtn:      'ПРАВИЛА',
    rulesClose:    'ПОНЯЛ',
    replayBtn:     'РЕПЛЕЙ',
    replayRunning: 'РЕПЛЕЙ МАТЧА',
    replayFinal:   'ФИНАЛЬНЫЙ КАДР',
    setupTitle:    'ИГРОКИ',
    setupStart:    'НАЧАТЬ',
    setupLabelC:   'ВАШ НИК',
    setupLabelP1:  'ИГРОК 1',
    setupLabelP2:  'ИГРОК 2',
    setupLabelW:   'Тип соперника',
    setupLabelBotDifficulty: 'Сложность бота',
    setupLabelRounds: 'Раунды',
    setupLabelMusic: 'МУЗЫКА',
    comingSoon:    'СКОРО...',
    musicOn:       'ВКЛ',
    musicOff:      'ВЫКЛ',
    defaultP1:     'Игрок 1',
    defaultP2:     'Игрок 2',
    opponentBot:    'БОТ',
    opponentLocal:  'ЛОКАЛЬНЫЙ',
    botBaby:       'БЕЙБИ',
    botNorm:       'НОРМ',
    botXO:         'ХО',
    winSub:        'захватывает поле',
    resultVictory: 'ПОБЕДА',
    resultDefeat:  'ПОРАЖЕНИЕ',
    rankUp:        'РАНГ ПОВЫШЕН —',
    rankedBadge:   'РАНГОВЫЙ РЕЖИМ',
    roundBadge:    'РАУНД {current}/{total}',
    nextRound:     'СЛЕД. РАУНД',
    modeDuel:      'ДУЭЛЬ',
    modeRanked:    'РАНГ',
    modeDaily:     'ВЫЗОВ',
    dailyBadge:    'ВЫЗОВ ДНЯ',
    dailyMovesLeft: 'ходов: {n}',
    dailyTime:     'время: {time}',
    dailyResultWin: 'время прохождения: {time}',
    dailyResultFail: 'итоговое время: {time}',
    matchTime:     'длительность матча: {time}',
    exportResult:  'СКАЧАТЬ',
    exportDate:    'дата',
    exportLabelPlayer: 'ИГРОК',
    exportLabelTitle: 'ТИТУЛ',
    exportLabelMode: 'РЕЖИМ',
    exportLabelTime: 'ВРЕМЯ',
    exportLabelDifficulty: 'СЛОЖН.',
    statsProgress: 'ПРОГРЕСС',
    statsMatches: 'МАТЧИ',
    statsWinRate: 'ВИНРЕЙТ',
    statsStreak: 'СТРИК',
    statsBest: 'ЛУЧШИЙ',
    statsAvgTime: 'СР. ВРЕМЯ',
    statsLastPlayed: 'ПОСЛЕДНИЙ',
    statsRecentMatches: 'ПОСЛЕДНИЕ МАТЧИ',
    statsNoHistory: 'ЕЩЁ НЕТ ИСТОРИИ',
    statsUnlockedTitles: 'ТИТУЛЫ',
    statsNoTitles: 'ТИТУЛЫ ЕЩЁ НЕ ОТКРЫТЫ',
    statsTitleCount: '{n} ОТКР.',
    statsSummaryWlt: '{wins}W / {losses}L / {draws}D',
    statsLastPlayedToday: 'СЕГОДНЯ',
    statsLastPlayedYesterday: 'ВЧЕРА',
    statsUnknown: '—',
    historyOutcomeWin: 'ПОБЕДА',
    historyOutcomeLoss: 'ПОРАЖЕНИЕ',
    historyOutcomeDraw: 'НИЧЬЯ',
    historyVsBot: 'vs БОТ',
    historyVsLocal: 'vs ЛОКАЛ',
    exportFlavorWin: 'сигнал закреплён // vanish помнит',
    exportFlavorLoss: 'контур дрогнул // реванш рядом',
    resultFlavorWins: [
      '«{name}» был беспощаден.',
      '«{name}» не оставил шансов.',
      '«{name}» сыграл хладнокровно.',
      '«{name}» исчез, но оставил легенду.',
      '«{name}» закрыл партию без дрожи.',
      '«{name}» держал ритм до конца.',
    ],
    resultFlavorLosses: [
      'контур дрогнул, но игра ещё не окончена.',
      'сетка ушла из рук, но не из памяти.',
      'сигнал сорвался, реванш уже рядом.',
      'эта ночь досталась не тебе.',
      'ходы погасли, но стиль остался.',
      'партия ушла в тень, следующая может стать твоей.',
    ],
    dailyCpuName:  'ВЫЗОВ',
    dailyFailed:   'ВРЕМЯ ВЫШЛО',
    dailyFailSub:  'попробуй завтра',
    dailyObjectives: {
      dailyObjWin:   'Победи любым способом.',
      dailyObjMoves: 'Победи за {n} ходов.',
      dailyObjBoard: 'Победи с заданной расстановкой.',
      dailyObjBoth:  'Победи за {n} ходов с заданной расстановкой.',
    },
    combos: {
      fadewin:      'ИСЧЕЗ И ПОБЕДИЛ',
      intercept:    'ПЕРЕХВАТ',
      doubleThreat: 'ДВОЙНАЯ УГРОЗА',
    },
    comboTitles: [
      'ЦЕПЬ',
      'ПЕРЕГРУЗ',
      'СИНХРО',
      'ФАНТОМ',
      'ИМПУЛЬС',
      'СИГНАЛ',
      'РАЗГОН',
      'КОНТУР',
      'ЭХО',
      'ПОТОК',
      'СДВИГ',
      'ПРОРЫВ',
    ],
    titles: {
      merciless: 'БЕСПОЩАДНЫЙ',
      rhythmBreaker: 'РАЗРУШИТЕЛЬ РИТМА',
      signalBinder: 'СВЯЗУЮЩИЙ СИГНАЛ',
      boardPhantom: 'ФАНТОМ ДОСКИ',
      challengeShade: 'ТЕНЬ ВЫЗОВА',
      coldblooded: 'ХЛАДНОКРОВНЫЙ',
      lastPulse: 'ПОСЛЕДНИЙ ИМПУЛЬС',
      silentHunter: 'ТИХИЙ ОХОТНИК',
      pressureLine: 'ЛИНИЯ ДАВЛЕНИЯ',
      fieldController: 'КОНТРОЛЬ ПОЛЯ',
      cleanFinish: 'ЧИСТЫЙ ФИНИШ',
    },
  },
  en: {
    subtitle:      "marks fade \u2022 legends don't",
    movesFirst:    name => `${name} MOVES FIRST`,
    placeYourMark: name => `${name} \u2014 PLACE YOUR MARK`,
    controlsGrid:  name => `${name} CONTROLS THE GRID`,
    wins:          name => `${name} WINS`,
    histLabel:     'move log',
    turnTag:       'your turn',
    restart:       'RESTART',
    playAgain:     'PLAY AGAIN',
    mainMenu:      'MAIN MENU',
    rulesBtn:      'RULES',
    rulesClose:    'GOT IT',
    replayBtn:     'REPLAY',
    replayRunning: 'MATCH REPLAY',
    replayFinal:   'FINAL FRAME',
    setupTitle:    'PLAYERS',
    setupStart:    'START',
    setupLabelC:   'YOUR NICKNAME',
    setupLabelP1:  'PLAYER 1',
    setupLabelP2:  'PLAYER 2',
    setupLabelW:   'Opponent Type',
    setupLabelBotDifficulty: 'Bot Difficulty',
    setupLabelRounds: 'Rounds',
    setupLabelMusic: 'MUSIC',
    comingSoon:    'COMING SOON...',
    musicOn:       'ON',
    musicOff:      'OFF',
    defaultP1:     'Player 1',
    defaultP2:     'Player 2',
    opponentBot:    'BOT',
    opponentLocal:  'LOCAL HUMAN',
    botBaby:       'BABY',
    botNorm:       'NORM',
    botXO:         'XO',
    winSub:        'controls the grid',
    resultVictory: 'VICTORY',
    resultDefeat:  'DEFEAT',
    rankUp:        'RANK UP —',
    rankedBadge:   'RANKED MODE',
    roundBadge:    'ROUND {current}/{total}',
    nextRound:     'NEXT ROUND',
    modeDuel:      'DUEL',
    modeRanked:    'RANKED',
    modeDaily:     'DAILY',
    dailyBadge:    'DAILY CHALLENGE',
    dailyMovesLeft: 'moves: {n}',
    dailyTime:     'time: {time}',
    dailyResultWin: 'clear time: {time}',
    dailyResultFail: 'final time: {time}',
    matchTime:     'match duration: {time}',
    exportResult:  'DOWNLOAD',
    exportDate:    'date',
    exportLabelPlayer: 'PLAYER',
    exportLabelTitle: 'TITLE',
    exportLabelMode: 'MODE',
    exportLabelTime: 'TIME',
    exportLabelDifficulty: 'DIFF',
    statsProgress: 'PROGRESS',
    statsMatches: 'MATCHES',
    statsWinRate: 'WIN RATE',
    statsStreak: 'STREAK',
    statsBest: 'BEST',
    statsAvgTime: 'AVG TIME',
    statsLastPlayed: 'LAST PLAYED',
    statsRecentMatches: 'RECENT MATCHES',
    statsNoHistory: 'NO MATCHES YET',
    statsUnlockedTitles: 'TITLES',
    statsNoTitles: 'NO TITLES UNLOCKED YET',
    statsTitleCount: '{n} UNLOCKED',
    statsSummaryWlt: '{wins}W / {losses}L / {draws}D',
    statsLastPlayedToday: 'TODAY',
    statsLastPlayedYesterday: 'YESTERDAY',
    statsUnknown: '—',
    historyOutcomeWin: 'VICTORY',
    historyOutcomeLoss: 'DEFEAT',
    historyOutcomeDraw: 'DRAW',
    historyVsBot: 'vs BOT',
    historyVsLocal: 'vs LOCAL',
    exportFlavorWin: 'signal locked // vanish remembers',
    exportFlavorLoss: 'the grid slipped // rematch soon',
    resultFlavorWins: [
      '{name} left no room to breathe.',
      '{name} played it cold.',
      '{name} closed the grid without a tremor.',
      '{name} vanished, but left a legend.',
      '{name} held the line to the end.',
      '{name} made it look inevitable.',
    ],
    resultFlavorLosses: [
      'the grid slipped away, but not for long.',
      'the signal broke, the rematch is near.',
      'this round fell into shadow.',
      'the board turned cold this time.',
      'the marks faded, the nerve did not.',
      'the line was lost, the style was not.',
    ],
    dailyCpuName:  'CHALLENGE',
    dailyFailed:   'OUT OF MOVES',
    dailyFailSub:  'try again tomorrow',
    dailyObjectives: {
      dailyObjWin:   'Win by any means.',
      dailyObjMoves: 'Win within {n} moves.',
      dailyObjBoard: 'Win from the given board.',
      dailyObjBoth:  'Win within {n} moves from the given board.',
    },
    combos: {
      fadewin:      'FADE & WIN',
      intercept:    'INTERCEPT',
      doubleThreat: 'DOUBLE THREAT',
    },
    comboTitles: [
      'CHAIN',
      'OVERDRIVE',
      'PHANTOM LINK',
      'NEON LOCK',
      'VOID SYNC',
      'SIGNAL BURST',
      'ECHO STRIKE',
      'GHOST THREAD',
      'LUCID CHAIN',
      'VANISH FLOW',
    ],
    titles: {
      merciless: 'MERCILESS',
      rhythmBreaker: 'RHYTHM BREAKER',
      signalBinder: 'SIGNAL BINDER',
      boardPhantom: 'BOARD PHANTOM',
      challengeShade: 'CHALLENGE SHADE',
      coldblooded: 'COLDBLOODED',
      lastPulse: 'LAST PULSE',
      silentHunter: 'SILENT HUNTER',
      pressureLine: 'PRESSURE LINE',
      fieldController: 'FIELD CONTROLLER',
      cleanFinish: 'CLEAN FINISH',
    },
  },
};

function t() { return T[lang]; }

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.getElementById('btn-ru').classList.toggle('active', l === 'ru');
  document.getElementById('btn-en').classList.toggle('active', l === 'en');

  // static elements with data-ru / data-en
  document.querySelectorAll('[data-ru]').forEach(el => {
    el.innerHTML = el.dataset[l];
  });
  document.getElementById('btn-restart').textContent    = t().restart;
  const btnExport = document.getElementById('btn-export');
  if (btnExport) btnExport.textContent = t().exportResult;
  const btnReplay = document.getElementById('btn-replay');
  if (btnReplay) btnReplay.textContent = t().replayBtn;
  document.getElementById('btn-again').textContent      = t().playAgain;
  const btnMenu = document.getElementById('btn-menu');
  if (btnMenu) btnMenu.textContent = t().mainMenu;
  document.getElementById('btn-rules').textContent      = t().rulesBtn;
  document.getElementById('btn-rules-close').textContent = t().rulesClose;
  document.getElementById('btn-setup-start').textContent = t().setupStart;
  document.getElementById('btn-mode-duel').textContent   = t().modeDuel;
  document.getElementById('btn-mode-ranked').textContent = t().modeRanked;
  document.getElementById('btn-mode-daily').textContent  = t().modeDaily;
  if (typeof window.syncAvailableModes === 'function') window.syncAvailableModes();
  if (typeof window.refreshLocalizedUi === 'function') window.refreshLocalizedUi();
  if (typeof window.setResultPresentation === 'function') {
    const winOverlay = document.getElementById('win-overlay');
    if (winOverlay && winOverlay.classList.contains('show')) {
      window.setResultPresentation(winOverlay.classList.contains('is-loss') ? 'loss' : 'win');
    }
  }

  // update setup input placeholders to match language defaults
  const inp1 = document.getElementById('input-p1');
  const inp2 = document.getElementById('input-p2');
  inp1.placeholder = t().defaultP1;
  if (inp2) inp2.placeholder = t().defaultP2;
  const labelP1 = document.getElementById('label-p1');
  const labelP2 = document.getElementById('label-p2');
  if (labelP1 && window.appState) {
    labelP1.textContent = window.appState.opponentType === 'local' ? t().setupLabelP1 : t().setupLabelC;
  }
  if (labelP2) labelP2.textContent = t().setupLabelP2;
  const btnOpponentBot = document.getElementById('btn-opponent-bot');
  const btnOpponentLocal = document.getElementById('btn-opponent-local');
  if (btnOpponentBot) btnOpponentBot.textContent = t().opponentBot;
  if (btnOpponentLocal) btnOpponentLocal.textContent = t().opponentLocal;
  const btnBotBaby = document.getElementById('btn-bot-baby');
  const btnBotNorm = document.getElementById('btn-bot-norm');
  const btnBotXO = document.getElementById('btn-bot-xo');
  if (btnBotBaby) btnBotBaby.textContent = t().botBaby;
  if (btnBotNorm) btnBotNorm.textContent = t().botNorm;
  if (btnBotXO) btnBotXO.textContent = t().botXO;
  const setupMusicLabel = document.getElementById('setup-music-label');
  const setupMusicText = document.getElementById('setup-music-text');
  if (setupMusicLabel) setupMusicLabel.textContent = t().setupLabelMusic;
  if (setupMusicText) setupMusicText.textContent = t().setupLabelMusic;
  const rankedLock = document.getElementById('setup-ranked-lock');
  if (rankedLock) rankedLock.textContent = t().comingSoon;
  const statsProgressLabel = document.getElementById('setup-progress-label');
  if (statsProgressLabel) statsProgressLabel.textContent = t().statsProgress;
  const statsMatchesLabel = document.getElementById('stats-label-matches');
  if (statsMatchesLabel) statsMatchesLabel.textContent = t().statsMatches;
  const statsWinRateLabel = document.getElementById('stats-label-winrate');
  if (statsWinRateLabel) statsWinRateLabel.textContent = t().statsWinRate;
  const statsStreakLabel = document.getElementById('stats-label-streak');
  if (statsStreakLabel) statsStreakLabel.textContent = t().statsStreak;
  const statsBestLabel = document.getElementById('stats-label-best');
  if (statsBestLabel) statsBestLabel.textContent = t().statsBest;
  const statsAvgLabel = document.getElementById('stats-label-avg');
  if (statsAvgLabel) statsAvgLabel.textContent = t().statsAvgTime;
  const statsLastLabel = document.getElementById('stats-label-last');
  if (statsLastLabel) statsLastLabel.textContent = t().statsLastPlayed;
  const setupHistoryTitle = document.getElementById('setup-history-title');
  if (setupHistoryTitle) setupHistoryTitle.textContent = t().statsRecentMatches;
  const setupHistoryEmpty = document.getElementById('setup-history-empty');
  if (setupHistoryEmpty) setupHistoryEmpty.textContent = t().statsNoHistory;
  const setupTitlesTitle = document.getElementById('setup-titles-title');
  if (setupTitlesTitle) setupTitlesTitle.textContent = t().statsUnlockedTitles;
  const setupTitlesEmpty = document.getElementById('setup-titles-empty');
  if (setupTitlesEmpty) setupTitlesEmpty.textContent = t().statsNoTitles;
  if (typeof window.setMusicButtonState === 'function') window.setMusicButtonState();
  if (typeof window.syncRankedLockState === 'function') window.syncRankedLockState();
  if (typeof window.syncLocalizedOpponentName === 'function') window.syncLocalizedOpponentName();
  if (typeof window.refreshPersistentProgress === 'function') window.refreshPersistentProgress();
}

export { t, setLang };

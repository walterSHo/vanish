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
    rulesBtn:      'ПРАВИЛА',
    rulesClose:    'ПОНЯЛ',
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
    rulesBtn:      'RULES',
    rulesClose:    'GOT IT',
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
  },
};

function t() { return T[lang]; }

function setLang(l) {
  lang = l;
  document.getElementById('btn-ru').classList.toggle('active', l === 'ru');
  document.getElementById('btn-en').classList.toggle('active', l === 'en');

  // static elements with data-ru / data-en
  document.querySelectorAll('[data-ru]').forEach(el => {
    el.innerHTML = el.dataset[l];
  });
  document.getElementById('btn-restart').textContent    = t().restart;
  document.getElementById('btn-again').textContent      = t().playAgain;
  document.getElementById('btn-rules').textContent      = t().rulesBtn;
  document.getElementById('btn-rules-close').textContent = t().rulesClose;
  document.getElementById('btn-setup-start').textContent = t().setupStart;
  document.getElementById('btn-mode-duel').textContent   = t().modeDuel;
  document.getElementById('btn-mode-ranked').textContent = t().modeRanked;
  document.getElementById('btn-mode-daily').textContent  = t().modeDaily;
  if (typeof syncAvailableModes !== 'undefined') syncAvailableModes();
  if (typeof updateModeBadge !== 'undefined') updateModeBadge();
  if (typeof updateAgainButtonLabel !== 'undefined') updateAgainButtonLabel();
  if (typeof updateDailyResultText !== 'undefined' && typeof gameMode !== 'undefined' && gameMode === 'daily' && typeof gameOver !== 'undefined' && gameOver) {
    updateDailyResultText(document.getElementById('score-display').textContent ? 'win' : 'fail');
  }

  // update setup input placeholders to match language defaults
  const inp1 = document.getElementById('input-p1');
  const inp2 = document.getElementById('input-p2');
  inp1.placeholder = t().defaultP1;
  if (inp2) inp2.placeholder = t().defaultP2;
  const labelP1 = document.getElementById('label-p1');
  const labelP2 = document.getElementById('label-p2');
  if (labelP1 && typeof updateSetupNicknameFields !== 'undefined') {
    labelP1.textContent = opponentType === 'local' ? t().setupLabelP1 : t().setupLabelC;
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
  if (typeof setMusicButtonState !== 'undefined') setMusicButtonState();
  if (typeof syncRankedLockState !== 'undefined') syncRankedLockState();
  if (typeof syncLocalizedOpponentName !== 'undefined') syncLocalizedOpponentName();

  // re-render dynamic status text
  if (typeof gameOver !== 'undefined' && !gameOver) {
    if (typeof historyCounter !== 'undefined' && historyCounter === 0) {
      const name = typeof nicknames !== 'undefined' ? nicknames.cipher : 'CIPHER';
      document.getElementById('status-msg').textContent = t().movesFirst(name);
      document.getElementById('status-msg').style.color = 'var(--cipher)';
    } else {
      const name = typeof nicknames !== 'undefined'
        ? nicknames[currentPlayer]
        : currentPlayer.toUpperCase();
      document.getElementById('status-msg').textContent = t().placeYourMark(name);
      document.getElementById('status-msg').style.color = currentPlayer === 'cipher' ? 'var(--cipher)' : 'var(--wraith)';
    }
  }
}

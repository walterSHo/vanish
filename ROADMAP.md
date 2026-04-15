# ROADMAP.md

## Project
VANISH — stylish browser-based infinite tic-tac-toe with disappearing oldest marks.

## Current phase
Polish setup flow and stabilize game-mode architecture for future Telegram Mini App support.

## Active goals

### 1. Setup menu polish
- simplify the menu UX
- make setup screen cleaner and more intuitive
- keep only one nickname field for the current user
- improve labels, spacing, and flow if needed

### 2. Opponent type flow
- add opponent type selection:
  - bot
  - local human
- remove setup dependence on opponent nickname
- use current user identity as the main profile concept

### 3. Mode gating
- if opponent type = bot:
  - Duel
  - Daily Challenge
- if opponent type = local human:
  - Duel
  - Ranked Match

### 4. In-match identity handling
- current user nickname should be shown in match UI
- opponent label depends on opponent type:
  - bot => BOT / WRAITH AI
  - local => GUEST / LOCAL OPPONENT

### 5. Telegram Mini App direction
- prefill current user nickname from Telegram if available
- keep setup editable
- do not create opponent identity from Telegram
- leave online mode for later

## Later goals
- improve bot behavior
- refine Daily Challenge logic
- refine Ranked Match rules
- online mode later
- telemetry / analytics only if needed later

## Out of scope for now
- full online multiplayer
- backend persistence
- account systems
- global ranking server
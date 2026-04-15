# CHANGELOG_AI.md

This file is a persistent AI task log.
Codex must update this file after every meaningful completed task.

## Format rules
For each new entry use:

### YYYY-MM-DD HH:MM - Short task title
- Goal:
- Files changed:
- What was changed:
- Why:
- Notes / follow-up:

---

## Entries

### 2026-04-15 19:00 - Initial AI memory setup
- Goal:
  Create persistent project memory files for Codex.
- Files changed:
  - AGENTS.md
  - ROADMAP.md
  - CHANGELOG_AI.md
- What was changed:
  Added long-term project context, roadmap, and changelog structure.
- Why:
  Reduce context loss across Codex sessions and avoid repeating the whole project history.
- Notes / follow-up:
  Future tasks should update this file after completion.

---
# 2026-04-15

- Polished the setup modal to use a single current-user nickname field instead of separate player name inputs.
- Removed opponent nickname entry from setup while preserving existing in-match behavior by keeping the default opponent name in code.
- Added a non-functional opponent type placeholder block in setup to support future local/bot selection without changing gameplay logic yet.

---

### 2026-04-15 19:25 - Added setup opponent type selector
- Goal:
  Add opponent type selection to the setup menu without changing gameplay logic or mode routing yet.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the setup placeholder block with an actual two-option selector for bot and local human, styled it to match the existing setup UI, and added a small JS state hook so the selected option stays highlighted when reopening setup.
- Why:
  Move the setup flow closer to the intended product direction while keeping scope tight and avoiding gameplay-side changes.
- Notes / follow-up:
  Opponent type is currently visual/setup state only. Mode gating and opponent-specific gameplay behavior still need to be implemented later.

---

### 2026-04-15 19:40 - Added mode gating in setup
- Goal:
  Make the available setup modes depend on the selected opponent type without changing in-match gameplay.
- Files changed:
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added setup-side mode availability rules so bot allows Duel and Daily while local human allows Duel and Ranked, disabled invalid mode buttons visually, and automatically switched back to a valid mode when the selected opponent type made the current mode invalid.
- Why:
  Align the setup flow with the intended product direction while keeping the implementation isolated to menu state.
- Notes / follow-up:
  This only affects setup availability. Match behavior still uses the existing mode logic and has not been changed yet.

---

### 2026-04-15 19:50 - Fixed setup mode tab overflow
- Goal:
  Keep the setup mode selector fully inside the modal container on desktop and mobile.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Updated the setup mode toggle to stretch to the modal width, made the tabs share space evenly, and added a small narrow-screen adjustment for tab font sizing and padding.
- Why:
  Prevent the right edge of the mode selector from overflowing outside the setup box while preserving the existing style.
- Notes / follow-up:
  This is a layout-only fix and does not change setup behavior or gameplay.

---

### 2026-04-15 19:58 - Fixed setup mode tab overlap
- Goal:
  Prevent the setup mode tabs from overlapping each other while keeping them inside one grouped control.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Switched the setup mode selector to a stable three-column grid, centered each tab label within its own cell, and kept the existing grouped visual treatment with internal dividers.
- Why:
  Ensure each mode tab has clean space and readable alignment across desktop and mobile widths without redesigning the menu.
- Notes / follow-up:
  This is a layout-only adjustment and does not affect setup state or gameplay logic.

---

### 2026-04-15 20:15 - Rebalanced setup mode tab widths
- Goal:
  Give the setup mode tabs enough usable width so "РАНГОВЫЙ" fits cleanly in one row.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Redistributed the three mode-tab columns to give the middle and right tabs more width, tightened button spacing slightly, and kept labels on a single line with mobile-safe sizing.
- Why:
  The equal-width layout kept the selector contained, but the ranked label still needed more usable space inside its tab.
- Notes / follow-up:
  This is a layout-only fix and does not change setup behavior or gameplay logic.

---

### 2026-04-15 20:25 - Shortened RU setup mode labels
- Goal:
  Shorten the visible Russian mode-tab labels so they fit cleanly in the setup menu.
- Files changed:
  - index.html
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Updated the visible RU mode labels in the setup selector to "ДУЭЛЬ", "РАНГ", and "ВЫЗОВ" while leaving English labels, internal mode keys, and logic unchanged.
- Why:
  The shorter Russian labels fit the grouped control more cleanly without needing further layout or gameplay changes.
- Notes / follow-up:
  This is a copy-only UI adjustment for the setup menu.

---

### 2026-04-15 20:40 - Added basic bot turns for bot mode
- Goal:
  Make bot mode actually play as a human vs computer match without changing the existing vanish and win systems.
- Files changed:
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added automatic bot turns for the WRAITH side when opponent type is bot, using a simple move priority of win, block, center, corners, then any empty cell. The bot now acts through the existing move pipeline so vanish behavior, win detection, history, score, and animations stay consistent. Also synced the default opponent name with localization for bot and daily matches.
- Why:
  The setup already exposed bot mode, but the second side was still waiting for manual input instead of being controlled by the computer.
- Notes / follow-up:
  The bot is intentionally basic for now and does not use advanced strategy beyond the requested priority rules.

---

### 2026-04-15 21:00 - Added random side assignment at match start
- Goal:
  Randomly assign the current user to CIPHER or WRAITH when a match starts and update match labels accordingly.
- Files changed:
  - index.html
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Removed fixed side text from the setup nickname label, added random side assignment for normal match starts, mapped the bot or second local player to the opposite side, and updated panel nicknames and the Telegram badge placement so they follow the actual assigned side after the match begins.
- Why:
  The setup and match flow previously assumed the current user was always CIPHER, which conflicted with the new random-side requirement.
- Notes / follow-up:
  Daily challenge setup still starts the current user on CIPHER to preserve the existing daily flow.

---

### 2026-04-15 21:20 - Added local match round-count selection
- Goal:
  Let local human matches run for a selected fixed number of rounds while keeping each round’s gameplay unchanged.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a local-only setup selector for 1, 3, or 5 rounds, tracked round wins across the selected series length, reused the existing top score bar as the running score, showed round progress in the mode badge, and turned the win-overlay button into a localized "next round" action until the series is complete.
- Why:
  Local human mode needed a simple match-length option without changing the underlying single-round board rules or redesigning the interface.
- Notes / follow-up:
  This is a fixed round-count series, not a best-of or elimination flow. Bot and daily modes remain single-round.

---

### 2026-04-15 21:35 - Added local-only second nickname field in setup
- Goal:
  Show one neutral nickname input for bot mode and two player nickname inputs for local human mode.
- Files changed:
  - index.html
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a second setup nickname input that appears only for local human mode, switched the primary setup label between neutral and player-specific text based on opponent type, and stored the second local nickname in setup state so local matches use both entered names.
- Why:
  Bot mode only needs one user nickname, while local human mode needs separate names for both players.
- Notes / follow-up:
  This task only updated setup UI/state and did not change the match logic itself.

---

### 2026-04-15 21:50 - Added duel-only bot difficulty selection
- Goal:
  Let bot duel matches choose between weaker and stronger bot behavior without changing the setup flow for local or non-duel modes.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a duel-only bot difficulty selector in setup with localized RU/EN labels for BABY, NORM, and XO. Reused the existing strongest bot logic as XO, then layered NORM and BABY on top by sometimes falling back to simpler valid moves instead of always taking the best tactical option.
- Why:
  Bot mode needed adjustable difficulty while preserving the current bot implementation as the highest difficulty and avoiding a larger AI rewrite.
- Notes / follow-up:
  Difficulty selection currently applies only to bot Duel matches, as intended.

---

### 2026-04-15 22:05 - Added browser-safe background music support
- Goal:
  Add calm low-volume background music that starts only after user interaction and can be toggled independently from sound effects.
- Files changed:
  - index.html
  - css/styles.css
  - js/audio.js
  - CHANGELOG_AI.md
- What was changed:
  Added a separate music toggle button in the header, styled it to match the existing audio controls, and extended the audio system with a soft generated ambient loop that starts only after the browser audio context is unlocked by user input. Music state now updates independently from the existing sound-effects toggle.
- Why:
  Improve the game atmosphere without violating autoplay restrictions or coupling background music to the existing SFX control.
- Notes / follow-up:
  The music currently uses generated Web Audio tones instead of an external track, which keeps the implementation lightweight and browser-safe.

---

### 2026-04-15 22:15 - Added subtle board coordinate labels
- Goal:
  Show board coordinates that match move-history notation while keeping the board clean and uncluttered.
- Files changed:
  - index.html
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added subtle `A B C` column labels above the board and `1 2 3` row labels along the left edge, using the existing neon-dark visual language and responsive spacing so the marks area stays untouched.
- Why:
  Make the board easier to read and align visually with the existing move-history coordinate notation.
- Notes / follow-up:
  This is a UI-only addition and does not change board behavior or gameplay logic.

---

### 2026-04-15 22:25 - Strengthened date-based Daily Challenge generation
- Goal:
  Make Daily Challenge behave like a real daily mode where each date deterministically produces its own setup and initial conditions.
- Files changed:
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Tightened the existing daily generator so it now builds the challenge from a date-derived seed using a deterministic shuffled cell order and a small set of seeded challenge profiles. The generated prefilled board and move-limit conditions now come directly from the current date in a stable way.
- Why:
  Daily mode already had date awareness, but this makes the daily setup more explicitly tied to the date and more reliable as a repeatable no-backend daily challenge.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js`. UI and gameplay flow outside Daily generation were left unchanged.

---

### 2026-04-15 22:35 - Added Daily Challenge timer layer
- Goal:
  Track completion time in Daily Challenge and surface it clearly without redesigning the existing game UI.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a Daily-only timer that starts on the first valid player move, updates live in the existing mode badge, stops on Daily win or fail, and shows the final time in the existing result overlay. Also added localized RU/EN timer strings and a small result line style.
- Why:
  Give Daily mode a clearer performance layer and make replays more meaningful while keeping the current interface structure intact.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js` and `node --check js/i18n.js`. The timer is isolated to Daily mode and does not affect Duel or Ranked flow.

---

### 2026-04-15 22:45 - Fixed music flow and added setup music toggle
- Goal:
  Make background music actually play after explicit user interaction and expose a clear music toggle inside the setup menu.
- Files changed:
  - index.html
  - css/styles.css
  - js/audio.js
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a visible localized music toggle to the setup modal, synced its ON/OFF state with the existing header control, and changed the music system to first try a real audio file at `assets/audio/bgm.mp3` with low looped volume. Since no actual music asset currently exists in the repo, the code now falls back to the existing generated ambient background so music still works after explicit user actions like Start, Daily accept, or the first board tap.
- Why:
  The previous music setup exposed UI state but did not provide a dependable audible playback flow tied to valid user gestures.
- Notes / follow-up:
  No music asset was found in the project during this task. To switch from fallback ambience to a real track, add a file at `assets/audio/bgm.mp3`. Syntax was checked with `node --check js/audio.js`, `node --check js/app.js`, and `node --check js/i18n.js`.

---

### 2026-04-15 22:55 - Added real background music playlist playback
- Goal:
  Use the actual audio files in `assets/audio/` for smooth looping background music with clean automatic track switching.
- Files changed:
  - js/audio.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the single-track music path logic with a fixed six-track playlist using the existing files in `assets/audio/`. Music now plays in sequence, preloads the upcoming track, fades out before track end, starts the next track automatically, and loops back to the first track after the last one. The existing music ON/OFF controls were kept and now pause or resume the real playlist cleanly.
- Why:
  The project now has actual music assets available, so background music needed to move from placeholder/fallback logic to a working playlist system that feels polished in real use.
- Notes / follow-up:
  Syntax was checked with `node --check js/audio.js`. Sound effects were left on the existing Web Audio path and were not changed.

---

### 2026-04-15 23:05 - Locked Ranked mode with coming soon state
- Goal:
  Keep Ranked visible in setup while clearly showing that it is not playable yet and preventing match start.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a small setup placeholder panel for Ranked with localized `СКОРО...` / `COMING SOON...`, and switched the setup start button into a disabled coming-soon state whenever Ranked is selected. Also added a guard in setup start logic so Ranked cannot launch even if triggered directly.
- Why:
  Ranked needs to stay visible as part of the planned product direction, but the current build should not let players enter unfinished mode flow.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js` and `node --check js/i18n.js`. Duel and Daily setup flow were left unchanged.

---

### 2026-04-15 23:15 - Started music from first menu interaction
- Goal:
  Make enabled background music begin from the menu as soon as the user first interacts, without waiting for gameplay start.
- Files changed:
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Extended the existing menu click handling so clicks on setup and menu controls now call the shared music unlock/start helper before playing UI click SFX. This includes mode tabs, menu buttons, opponent selectors, bot difficulty buttons, round selectors, and the existing music controls.
- Why:
  Music playback was already working, but the first reliable start trigger happened too late in the flow, so menu navigation felt silent until the user entered gameplay or another later state.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js`. The playlist logic itself was left unchanged, so menu and gameplay continue using the same ongoing music session without unnecessary restarts.

---

### 2026-04-15 23:20 - Updated roadmap for post-demo phase
- Goal:
  Refresh the project roadmap to reflect the current post-demo priorities before Telegram Mini App adaptation.
- Files changed:
  - ROADMAP.md
  - CHANGELOG_AI.md
- What was changed:
  Replaced the earlier setup-flow roadmap with a new post-demo roadmap focused on audio polish, ranked-mode completion, final UX cleanup, and Telegram Mini App preparation.
- Why:
  The project direction has moved past initial setup/menu groundwork and now needs a clearer plan for polishing the public demo into the next stage.
- Notes / follow-up:
  This was a planning-only update and did not change gameplay or UI code.

---

### 2026-04-15 23:30 - Added minimal mobile responsive foundation
- Goal:
  Make the layout safer on small mobile widths without redesigning the desktop interface.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added a small responsive foundation to the existing stylesheet: explicit horizontal overflow protection, footer wrapping, safer badge text wrapping, and narrow-screen adjustments for header spacing, player panels, board size, and key text sizing at `430px` and `360px` breakpoints.
- Why:
  The desktop layout was visually consistent, but the combined width of the side panels, board, header, and controls could overflow on phones around `320px–430px`.
- Notes / follow-up:
  The existing viewport meta tag in `index.html` was already correct, so no HTML change was needed for this task.

---

### 2026-04-15 23:45 - Improved mobile setup menu layout
- Goal:
  Make the setup screen comfortable and readable on mobile without redesigning the current menu.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added setup-specific mobile sizing and spacing improvements: the setup modal now uses safe viewport padding, scrolls vertically if content grows tall, stays fully inside the screen, and gives tabs, toggles, inputs, music control, and the Start button larger touch-friendly heights. Also tightened setup spacing and type sizing at narrow widths so the sections stack cleanly without horizontal scrolling.
- Why:
  The setup menu had become crowded on phones, so the controls needed a stronger responsive foundation to remain readable and easy to tap.
- Notes / follow-up:
  This was a CSS-only setup polish pass. Existing setup logic and gameplay behavior were not changed.

---

### 2026-04-16 00:00 - Improved mobile gameplay layout
- Goal:
  Make the in-game screen readable and usable on phones while preserving the current visual style.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added gameplay-focused mobile layout rules that keep the board centered, move the side player panels into a compact row beneath the board on narrow screens, and tighten panel/rank sizing so labels stay readable without overflow. Also improved small-screen spacing for status text, move history, warning text, and footer action buttons so the gameplay UI remains touch-friendly and avoids horizontal scrolling.
- Why:
  The desktop-oriented gameplay layout could become cramped on phones, especially with the board and side panels competing for width in one row.
- Notes / follow-up:
  This was a CSS-only responsive pass for the gameplay screen. No gameplay or state logic was changed.

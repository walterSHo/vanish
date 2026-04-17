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

---

### 2026-04-16 00:10 - Improved orange gameplay hint visibility
- Goal:
  Make the orange hint above the board easier to read without changing its wording or overall placement.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Brightened the hint color, increased its effective contrast and opacity, added a subtle warm glow, and slightly improved letter spacing and line height so the text reads more clearly on the dark background and in demos.
- Why:
  The original hint styling was a bit too faint for quick readability, especially in gameplay videos and on dark displays.
- Notes / follow-up:
  This was a tight visual polish pass only. The text content and layout structure were left unchanged.

---

### 2026-04-16 00:20 - Added neon mark-destruction animation
- Goal:
  Make the oldest-mark vanish mechanic feel clearer and more satisfying without changing gameplay timing in a noticeable way.
- Files changed:
  - css/styles.css
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the simple shrink-out vanish with a short neon destruction effect: the disappearing mark now gets a faction-colored glow surge, collapse, and energy-ring dissolve, while the cell flashes briefly to make the removal clearer. Also added a small helper so mark elements consistently carry faction-specific animation classes.
- Why:
  The oldest-mark removal was functionally correct but visually too plain for such a signature mechanic, especially in demos and on mobile.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js`. The vanish timing remains short and the gameplay rules were not changed.

---

### 2026-04-16 00:35 - Reworked mobile gameplay composition
- Goal:
  Make the gameplay screen feel like a native mobile game layout instead of a compressed desktop arrangement.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Rebuilt the phone layout around a board-first composition: on mobile the board now takes significantly more space, while the player panels become compact HUD cards beneath it with lighter typography, smaller symbols, and denser status info. Also tightened move history and footer button sizing so secondary controls stay accessible without competing with the board.
- Why:
  The previous mobile pass was safe, but it still felt like the desktop composition had only been shrunk down. The gameplay screen needed a stronger mobile-first hierarchy.
- Notes / follow-up:
  This was a CSS-only layout change for narrow screens. Desktop layout and gameplay logic were left intact.

---

### 2026-04-16 00:45 - Upgraded next-removal tactical marker
- Goal:
  Make the next-removal cell indicator feel more futuristic and polished while keeping its gameplay meaning unchanged.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Reworked the existing orange corner marker into a layered HUD-style tactical indicator with a breathing neon frame, staggered corner pulses, and a subtle internal scan sweep. The same cell is still highlighted by the same logic, but the visual treatment now feels more alive and consistent with the VANISH interface style.
- Why:
  The previous indicator was functional but too static and plain for such an important mechanic in a neon sci-fi game.
- Notes / follow-up:
  This was a CSS-only visual upgrade. Gameplay logic, indicator meaning, and board clarity were preserved.

---

### 2026-04-16 01:00 - Added localized combo title feedback
- Goal:
  Make combo-worthy moments feel more exciting with short stylish localized titles and a stronger HUD-like animation.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Extended the existing combo banner into a two-line HUD moment with a compact randomized combo title plus the existing combo message. Added separate curated title pools for RU and EN, prevented immediate title repeats, and kept non-combo system banners like rank-up and daily fail using the same banner without forced random titles.
- Why:
  The previous combo feedback worked, but it was too repetitive and visually flat for standout tactical moments in VANISH.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js` and `node --check js/i18n.js`. Combo detection logic itself was left unchanged.

---

### 2026-04-16 01:15 - Added combo-specific destruction variants
- Goal:
  Keep normal mark removal clean while giving stronger combo moments their own distinct destruction feel.
- Files changed:
  - css/styles.css
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Extended the mark-destruction system with combo-aware variants that sit in the same visual family as the base vanish effect but add distinct signal, fracture, ripple, void, and overdrive behaviors. The move flow now predicts stronger combo-style moments before removal and applies a lightweight variant class only for those cases, while standard removals continue using the default destruction animation.
- Why:
  Combo turns needed their own event class visually, not just a slightly bigger version of the normal vanish.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js`. Gameplay rules and combo detection flow were not changed.

---

### 2026-04-16 01:30 - Added procedural combo and UI sound effects
- Goal:
  Strengthen UI and combo feedback with lightweight synthesized Web Audio SFX while keeping the music system unchanged.
- Files changed:
  - js/audio.js
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the simple tone-only SFX layer with a more expressive procedural Web Audio setup using short oscillator and filtered noise envelopes. Added refined synthesized sounds for digital target-change clicks, normal destruction, and three combo tiers (`light`, `medium`, `heavy`), then hooked existing combo events to those tiers without changing combo logic.
- Why:
  The game already had a centralized audio path, so it was the cleanest place to add richer neon-HUD sound feedback without introducing any external asset files.
- Notes / follow-up:
  Background music logic was left unchanged. Syntax was checked with `node --check js/audio.js` and `node --check js/app.js`.

---

### 2026-04-17 00:10 - Removed combo banner panel chrome
- Goal:
  Make combo feedback feel lighter and more premium by turning it into floating neon text instead of a boxed popup.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Removed the combo popup background, border, and panel-like sweep overlay while keeping the text content and appearance animation. Refined the combo feedback into a floating text treatment with subtle neon glow and a cleaner rise-in motion.
- Why:
  The combo effect was readable, but the visible panel chrome made it feel heavier and more like a notification box than a premium game UI moment.
- Notes / follow-up:
  This was a CSS-only polish pass. Combo logic and text structure were left unchanged.

---

### 2026-04-17 00:25 - Added subtle UI micro-interactions
- Goal:
  Improve perceived polish with restrained motion and clearer interaction feedback across existing UI elements.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added a lightweight motion pass to buttons, tabs, segmented controls, language/audio toggles, active player state, move-history items, modal boxes, and win presentation. The changes focus on small lift/press feedback, gentle text and panel movement, cleaner item entry, and a reduced-motion fallback for the added interaction layer.
- Why:
  The interface already had strong visuals, but many controls and state changes still felt static compared to the rest of the VANISH atmosphere.
- Notes / follow-up:
  This was a CSS-only polish task. Gameplay rules and UI structure were not changed.

---

### 2026-04-17 00:40 - Added win/loss result presentation
- Goal:
  Make match endings feel clearer and more satisfying with distinct victory and defeat feedback.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/audio.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Extended the existing result overlay with a localized `VICTORY / DEFEAT` state label and split presentation modes for win and loss. Wins keep a brighter rising signal feel, while losses use a dimmer colder presentation with softer text and symbol treatment. Also added a procedural loss SFX and routed end-of-match audio so the current player hears either win or loss feedback depending on the outcome.
- Why:
  Match endings already had a functional overlay, but victories and defeats did not feel clearly separated as premium result moments.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js`, `node --check js/audio.js`, and `node --check js/i18n.js`. Gameplay rules were not changed.

---

### 2026-04-17 00:55 - Added replay and menu result actions
- Goal:
  Give the player clear next-step choices after a match ends without breaking the existing match flow.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a second post-match action button for `В МЕНЮ / MAIN MENU` alongside the existing replay action, grouped them into a dedicated result action row, and updated replay so it starts a fresh match cleanly with the current mode and settings instead of bouncing back to setup. Returning to menu continues to use the existing clean setup flow.
- Why:
  The result overlay needed clearer next steps, and the old replay behavior did not actually behave like a true rematch after a finished game.
- Notes / follow-up:
  Syntax was checked with `node --check js/app.js` and `node --check js/i18n.js`. Gameplay rules were not changed.

---

### 2026-04-17 01:15 - Added match duration to the result summary
- Goal:
  Track how long a match lasts and present that duration cleanly at the end.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a dedicated localized match-duration line to the end-of-match overlay and introduced a lightweight match timer that starts when a match begins and stops on win or loss. Replay, next-round restart, daily challenge start, and return-to-menu flows now clear timer state before starting or leaving a match.
- Why:
  The project already had a Daily Challenge timer, but regular match results still lacked a clean general duration summary.
- Notes / follow-up:
  The timer stays out of the main gameplay view to avoid clutter. Syntax should be checked with `node --check js/app.js` and `node --check js/i18n.js`.

---

### 2026-04-17 01:35 - Added polished end-of-match summary block
- Goal:
  Gather the key match facts into one stylish result block that feels cleaner and more shareable.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a compact result summary panel to the match overlay with localized rows for result state, player name, mode, time, and bot difficulty when applicable. Connected the panel to existing end-of-match flow so it fills from real match data for wins and losses while keeping the rest of the overlay behavior intact.
- Why:
  The result overlay already had strong headline feedback, but the important match facts were still split across separate lines instead of being collected into one clean shareable block.
- Notes / follow-up:
  This keeps the current dark-neon style and reuses existing mode, timer, and difficulty state without changing gameplay rules. Syntax should be checked with `node --check js/app.js` and `node --check js/i18n.js`.

---

### 2026-04-17 01:55 - Added PNG export for final match results
- Goal:
  Let players save a polished shareable result card directly from the end-of-match screen.
- Files changed:
  - index.html
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Added a new post-match export action that renders a dedicated VANISH-styled result card to an in-memory canvas and downloads it as a PNG. The export includes the outcome, player name, match duration, mode, bot difficulty when relevant, a short localized flavor line, and a date label, all without adding external libraries or relying on screenshot capture.
- Why:
  The result overlay was already visually strong, so a custom browser-safe canvas export was the lightest way to turn the same match data into a cleaner, more intentional share image.
- Notes / follow-up:
  The export is self-contained and compatible with static hosting. Syntax should be checked with `node --check js/app.js` and `node --check js/i18n.js`.

---

### 2026-04-17 02:10 - Added dynamic result flavor lines
- Goal:
  Make end-of-match results feel more alive with short stylish callouts that add personality without breaking the VANISH tone.
- Files changed:
  - css/styles.css
  - js/app.js
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the static result subtitle with randomized localized flavor lines selected from curated RU and EN pools. Wins now use named winner callouts built around the actual player name, while losses use short restrained dramatic lines. The chosen line is kept consistent between the result screen and PNG export.
- Why:
  The result overlay already looked polished, but a single repeated subtitle made match endings feel more static than the rest of the experience.
- Notes / follow-up:
  This was a UI-copy and state-only polish change. Gameplay rules and match flow were not changed. Syntax should be checked with `node --check js/app.js` and `node --check js/i18n.js`.

---

### 2026-04-17 02:20 - Improved move history readability
- Goal:
  Make the move history easier to scan quickly while keeping its tag-like VANISH presentation.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Increased the visual weight of move history tags with larger type, stronger contrast, slightly roomier spacing, and clearer faction-colored styling. The history label was also brightened a bit, and mobile sizes were adjusted so the tags stay readable without becoming bulky.
- Why:
  The original move history looked stylish, but the tags were a little too small and faint for fast at-a-glance reading during play.
- Notes / follow-up:
  This was a CSS-only polish pass. Gameplay logic and history structure were not changed.

---

### 2026-04-17 02:30 - Improved board coordinate visibility
- Goal:
  Make the board coordinates easier to notice and read while keeping them integrated into the VANISH HUD style.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Increased the size, contrast, spacing, and glow of the `A B C / 1 2 3` labels and gave them a more deliberate tactical-HUD treatment with subtle panel-like backing. Mobile coordinate sizes were also raised so they stay readable on smaller screens without overpowering the board.
- Why:
  The coordinate labels were aligned correctly, but they still felt a bit too faint and helper-like compared to the rest of the interface.
- Notes / follow-up:
  This was a CSS-only visibility polish. Board logic and coordinate notation were not changed.

---

### 2026-04-17 02:40 - Reworked next-vanish target into a fade-phase indicator
- Goal:
  Make the next-vanish target feel like it is about to disappear instead of behaving like a warning flash.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Replaced the old yellow flicker rhythm of the next-vanish marker with a softer phasing cycle built around opacity loss and gentle visibility drops. The corner frame and internal sweep now fade in and out more logically, so the target reads as unstable and about to vanish rather than simply flashing for attention.
- Why:
  The previous marker was readable, but its warning-like flicker suggested alarm more than disappearance. A fade-phase treatment better matches the VANISH mechanic and improves visual logic.
- Notes / follow-up:
  This was a CSS-only animation polish. Target logic and gameplay behavior were not changed.

---

### 2026-04-17 02:50 - Strengthened combo destruction identities
- Goal:
  Make combo-linked removals feel more special and more clearly distinct from ordinary vanish events.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Expanded the visual separation between normal and combo destruction by giving combo variants stronger, more individualized motion signatures and cell energy treatments. Signal burst now reads as a tactical lattice blast, phantom ripple drifts more like a ghosted echo, neon fracture breaks into harsher luminous shards, echo split shears into dual streaks, void collapse sinks inward more aggressively, and overdrive pulse now blooms into a larger radiant crown.
- Why:
  The combo system already had variant hooks, but the effects still felt too close to the base vanish family in motion. This pass makes them read as a genuinely different event class while staying inside the same VANISH universe.
- Notes / follow-up:
  This was a CSS-only visual polish pass. Combo selection logic and gameplay behavior were not changed.

---

### 2026-04-17 03:05 - Added a short pause before final result reveal
- Goal:
  Give players a brief moment to register the last move and final board state before the result overlay appears.
- Files changed:
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Added a dedicated delayed-reveal timer for the end-of-match overlay so win and loss presentation no longer appears instantly after the final move. The timer is also cleared during replay, restart, and menu-return flows to prevent stale result overlays from showing later.
- Why:
  The final result state was appearing too abruptly, which made the last move harder to read during play and in video capture.
- Notes / follow-up:
  This is a pacing-only change. Win detection, scoring, and gameplay rules were not changed.

---

### 2026-04-17 03:20 - Added a dedicated line-completion animation
- Goal:
  Make three-in-a-row completion feel more special and clearly recognized before the final result overlay appears.
- Files changed:
  - css/styles.css
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Upgraded winning-line highlighting from a static state into a short staged confirmation effect. Winning cells now receive a connected neon pulse, a staggered signal sweep, and a brief mark lock-in glow so the completed line reads as an intentional sci-fi confirmation before the result overlay takes over.
- Why:
  The win state was readable, but the completed line itself did not yet have a distinct “connection confirmed” moment on the board.
- Notes / follow-up:
  This change only affects presentation and pacing of the existing win highlight. Win detection and gameplay behavior were not changed.

---

### 2026-04-17 03:35 - Refined post-match action layout and labels
- Goal:
  Make the end-of-match action area feel clearer, more intentional, and more natural as a proper closing button row.
- Files changed:
  - index.html
  - css/styles.css
  - js/i18n.js
  - CHANGELOG_AI.md
- What was changed:
  Reworked the result overlay actions into a cleaner grouped layout with replay on the left and menu on the right, while keeping download as a clear secondary action beneath them. The export label was also renamed from `PNG` / `SAVE PNG` to user-facing `СКАЧАТЬ` / `DOWNLOAD`.
- Why:
  The previous arrangement felt like three separate controls rather than one coherent post-match action area, and the export label looked technical instead of player-friendly.
- Notes / follow-up:
  This was a UI and localization polish pass only. Replay, menu, and export behavior were not changed.

---

### 2026-04-17 03:50 - Moved vanish warning from frame to symbol
- Goal:
  Make the next-vanish cue feel more logical by showing instability directly on the mark that is about to disappear.
- Files changed:
  - css/styles.css
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Replaced the cell-level orange warning frame with a mark-level `vanish-target` treatment applied to the oldest active symbol. The cross or circle now carries the warning through soft opacity phasing, subtle glow breathing, and a light echo aura so it feels like the mark itself is slipping out of reality.
- Why:
  The previous outline communicated state, but it felt more like an external selection frame than a true disappearance cue. Moving the effect onto the symbol makes the vanish logic easier to read and more consistent with the VANISH atmosphere.
- Notes / follow-up:
  This change is visual only. Vanish order and gameplay behavior were not changed.

---

### 2026-04-17 04:00 - Split vanish-target motion by mark type
- Goal:
  Give crosses and circles distinct vanish-target personalities while keeping both inside the same VANISH visual language.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Replaced the shared mark-warning motion with separate CSS animation sets for the two symbol types. Crosses now use a sharper signal-like instability with slight angular drift and fractured sweep energy, while circles use a smoother phased/orbital fade with softer aura breathing and rounded echo expansion.
- Why:
  The previous shared animation communicated disappearance clearly, but it made both mark types feel too similar. This pass gives each symbol its own motion character without adding clutter or changing the underlying vanish logic.
- Notes / follow-up:
  This was a CSS-only presentation update. Gameplay behavior and mark order were not changed.

---

### 2026-04-17 04:10 - Restored proper button framing for the post-match menu action
- Goal:
  Make the `В МЕНЮ` action feel like a real button again and restore consistency inside the post-match action row.
- Files changed:
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added a targeted style override for the menu action inside the result button row so it uses a full button frame, centered label, and the same balanced clickable area as the replay button. The menu action still keeps a slightly softer emphasis than the primary replay action.
- Why:
  The shared ghost-button styling made the menu action read too much like floating text instead of a proper peer inside the same horizontal button group.
- Notes / follow-up:
  This was a CSS-only layout and styling fix. Button behavior was not changed.

---

### 2026-04-17 04:30 - Added persistent local stats and match history storage
- Goal:
  Keep player activity across sessions and create a reusable local data foundation for future replay and title systems.
- Files changed:
  - js/app.js
  - CHANGELOG_AI.md
- What was changed:
  Added a centralized browser `localStorage` save layer with schema versioning, safe load/save handling, and a structured persistent profile containing aggregate stats plus saved match entries. Finished matches are now recorded automatically with mode, opponent type, difficulty when relevant, timestamp, duration, player names, side used, initial/final state snapshots, and full turn sequence data derived from the existing move history. Aggregate stats now persist total matches, wins, losses, win rate, current and best streak, average duration, side usage, mode usage, and bot-difficulty usage.
- Why:
  The game already tracked enough runtime state to describe a finished match, but none of it survived reloads. Persisting that data now creates a stable local foundation for later replay, titles, and longitudinal player activity.
- Notes / follow-up:
  Match history is capped to the newest 250 saved entries for local robustness. This change does not alter gameplay rules or current UI flow.

---

### 2026-04-17 04:55 - Added persistent title and epithet selection
- Goal:
  Give players a more memorable identity by tying result titles to actual match style and long-term performance.
- Files changed:
  - js/app.js
  - js/i18n.js
  - index.html
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added a localized title system with explainable rule-based selection on top of the persistent match-history layer. Match results can now surface epithets such as fast-win, long-control, XO-bot, streak, side-mastery, and daily-specialist titles, while unlocked titles are stored in local save data for reuse as persistent player identity. The selected title is now shown in the end-of-match summary and included in PNG export.
- Why:
  Flavor lines already added atmosphere, but they were still one-off presentation. Titles make match outcomes feel more personal and connect identity to how the player actually performs over time.
- Notes / follow-up:
  This keeps the current gameplay unchanged and reuses the new local save foundation. A separate title collection/progression view can be added later on top of the same saved data.

---

### 2026-04-17 05:15 - Added replay and final-cinematic playback for finished matches
- Goal:
  Let players rewatch the completed match flow from real saved move data and give the ending a stronger cinematic payoff.
- Files changed:
  - js/app.js
  - js/i18n.js
  - index.html
  - css/styles.css
  - CHANGELOG_AI.md
- What was changed:
  Added a new post-match `REPLAY` action that reconstructs the most recent finished match from saved history instead of using fake video playback. Replay now resets the board to the saved initial state, replays moves in order with vanish events reconstructed from recorded turn data, and ends with a short final focus on the decisive line or final board state before restoring the result overlay.
- Why:
  The match already had persistent move history and final-result presentation, but there was no way to revisit the final flow itself. Reusing saved turns creates a lightweight and maintainable foundation for future history-entry replay too.
- Notes / follow-up:
  This first pass supports the most recent finished match through the existing saved history structure. Gameplay rules and live-match behavior were not changed.

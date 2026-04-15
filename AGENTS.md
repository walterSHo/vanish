# AGENTS.md

## Project
VANISH is a browser mini-game: an infinite tic-tac-toe variant with a vanish mechanic.

Core gameplay:
- Board size: 3x3
- Two factions: CIPHER and WRAITH
- Each player can have at most 3 active marks
- When a player places a 4th mark, their oldest active mark disappears
- Win condition: 3 active marks in a line

## Tech stack
- Static frontend only
- HTML, CSS, JavaScript
- No backend
- No framework
- No canvas

## Active project structure
- index.html
- css/styles.css
- js/app.js
- js/i18n.js
- js/audio.js
- js/telegram.js

Ignore legacy duplicate files if any still exist in root or old folders.

## Product direction
This project is being prepared for future Telegram Mini App usage.

Current intended setup flow:
- The user enters only their own nickname
- The user chooses opponent type:
  - bot
  - local human
- Available modes depend on opponent type:
  - bot => Duel, Daily Challenge
  - local => Duel, Ranked Match
- Do NOT require entering opponent nickname in setup
- Telegram data, if available, should prefill only the current user nickname

## Current status
Already implemented:
- multi-file structure
- RU / EN localization
- sound effects
- setup / menu screen
- core vanish mechanic
- visual style and game UI
- basic Telegram readiness work
- some mode logic groundwork

Recently fixed:
- phantom ghost mark on start
- doubled grid issue
- cell size inconsistency

Current priority:
1. Polish the setup menu
2. Implement clean opponent-type flow
3. Support bot and local-human mode routing
4. Continue mode-specific gameplay behavior

## Design direction
- dark neon cyber-street / graffiti aesthetic
- stylish but clean
- preserve current visual identity
- do not redesign unless explicitly asked

## Working rules for Codex
Always follow these rules:
1. Do not rewrite the project from scratch
2. Make the smallest possible changes
3. Read only files relevant to the current task
4. Do not inspect the whole project unless explicitly requested
5. Do not refactor unrelated parts
6. Preserve existing gameplay logic unless the task explicitly changes it
7. Preserve visual style unless the task explicitly changes it
8. Output only changed files unless explicitly asked otherwise
9. After completing any meaningful task, update CHANGELOG_AI.md
10. If a task changes project direction or decisions, also update ROADMAP.md

## Prompt handling
For each new task:
- first read AGENTS.md
- then read only files relevant to that task
- keep scope tight
- avoid unnecessary reads of large files
- avoid repeated planning summaries

## Done criteria
A task is done when:
- requested behavior works
- no unrelated regressions are introduced
- only relevant files were touched
- CHANGELOG_AI.md is updated
- ROADMAP.md is updated if the task changes future plans or decisions

## Token efficiency rules
Token efficiency is a hard requirement.

Always follow these rules:
1. Prefer the smallest correct change
2. Read only files directly relevant to the task
3. Never scan the whole project unless explicitly requested
4. Avoid full-file rewrites when a small patch is enough
5. Avoid repeating long plans or summaries
6. Avoid unnecessary explanations in output
7. Output only changed files unless explicitly asked otherwise
8. Keep each session focused on one task only
9. Prefer narrow diffs over broad refactors
10. If the task becomes larger than expected, stop and suggest splitting it into smaller tasks
11. Reuse information from AGENTS.md, ROADMAP.md, and CHANGELOG_AI.md instead of rediscovering context
12. If only one file is likely relevant, inspect only that file first
13. Do not reread the same large file multiple times unless necessary
14. Do not investigate speculative problems outside the stated task
15. When possible, verify with the smallest targeted check instead of broad project-wide review

## Model selection rules
Choose the model deliberately based on task size and complexity.

Default guidance:
- Use a lighter / cheaper model for:
  - simple copy changes
  - text replacements
  - small CSS fixes
  - small UI adjustments
  - straightforward one-file edits
  - changelog or roadmap updates
- Use a stronger coding model for:
  - multi-file logic changes
  - mode-routing changes
  - bug fixing with unclear root cause
  - state management edits
  - gameplay logic changes
  - architecture-sensitive work

Reasoning effort guidance:
- low:
  - simple edits
  - text/UI copy tweaks
  - tiny isolated bug fixes
- medium:
  - default for most tasks
  - use for normal bug fixing and feature work
- high:
  - only for genuinely hard debugging
  - architecture changes
  - complex refactors
  - use rarely because it may increase token usage

Decision policy:
- Start with the cheapest model likely to succeed
- Escalate to a stronger model only if the cheaper one fails or the task is clearly complex
- Do not use high reasoning by default
- Do not use the strongest model for routine UI or text edits
# ROADMAP.md

## Project

VANISH — stylish browser-based infinite tic-tac-toe with disappearing oldest marks.

## Current phase

Post-demo polish and feature completion before Telegram Mini App adaptation.

## Active goals

### 1. Audio polish

- make background music start reliably from the first valid user interaction
- remove the issue where music starts only after several button presses
- keep playlist transitions smooth
- preserve music ON/OFF behavior cleanly across menu and gameplay

### 2. Ranked mode completion

- keep Ranked mode visually intentional
- finish locked / coming soon flow or replace it with the real playable ranked flow
- prevent broken or half-ready ranked UX
- define ranked-specific rules, progression, and result handling

### 3. Core UX cleanup

- review setup flow one more time after public demo testing
- fix small friction points found by friends/testers
- keep the interface clean, readable, and consistent
- preserve the current visual identity

### 4. Telegram Mini App preparation

- prepare the project for Telegram Mini App embedding
- review launch flow inside Telegram context
- adapt identity/bootstrap logic for Telegram user data
- keep the web version as the base reference

## Later goals

- improve bot behavior
- expand Daily Challenge logic
- add better end-of-match feedback
- add result sharing or social hooks
- telemetry / analytics only if truly needed

## Out of scope for now

- full online multiplayer
- backend persistence
- account systems
- global ranking server

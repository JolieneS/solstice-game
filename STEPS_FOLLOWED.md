# 🛠️ SOLSTICE — Steps Followed

A detailed record of every step taken to build this game from scratch.

---

## Step 1 — Basic Grid
- Created a 6×12 grid using CSS Grid
- Used `createElement` in a loop to generate 72 cells dynamically
- Added `data-row` and `data-col` to each cell for click detection

## Step 2 — Game State
- Built a 2D array where each cell stores `owner` and `count`
- `owner` = 0 (empty), 1, 2, 3, or 4 (player number)
- `count` = number of orbs in that cell

## Step 3 — Cell Capacity
- Built `getCapacity(r, c)` by counting valid neighbours
- Corner cells = 2, edge cells = 3, middle cells = 4

## Step 4 — Placing Orbs
- Added click handler on each cell
- First move: any empty cell
- After first move: only own cells
- Orbs rendered as small circles inside each cell

## Step 5 — Explosions
- Built `explode(r, c, player)` — clears cell, adds 1 orb to each neighbour
- Built `processChain(player)` — while loop that keeps exploding until board is stable
- Captured cells become the exploding player's color

## Step 6 — Win Condition
- After each move, check if any player has zero cells
- If only one player remains → they win

## Step 7 — Timers
- Added global game timer counting up in seconds
- Added 30-second turn timer
- Turn auto-skips when timer hits 0
- Both timers pause and resume together

## Step 8 — Scoring
- Points awarded for each orb placed
- Extra points when capturing enemy cells during explosion

## Step 9 — Restart Button
- Resets grid, scores, timers, all variables back to initial state

## Step 10 — Sound Effects
- Built `playSound(type)` using Web Audio API
- Three sounds: place, explode, win
- Added intro thriller sound using sawtooth oscillator waves

## Step 11 — Multiplayer (2–4 Players)
- Replaced p1/p2 variables with arrays: `scores[]`, `firstMove[]`
- Turn cycling with modulo: `(currentPlayer % numPlayers) + 1`
- Win condition loops through all players
- Dynamic score display builds from array

## Step 12 — Season Picker
- Added season selection screen before game
- Each player picks a season — ❄️ Winter ☀️ Summer 🌧️ Monsoon 🍂 Autumn
- Orbs display as season emoji instead of colored balls
- `SEASONS` object stores emoji, label, background per season

## Step 13 — Portal Teleportation
- Defined 2 portal pairs at fixed positions on the board
- Marked with 🌀 emoji and violet border
- Rule: empty portal receives orb via neighbour explosion → teleports to linked cell
- Portal with existing orbs behaves like a normal cell
- First move cannot be placed on portal cell
- Built `isPortal(r, c)` and `getLinkedPortal(r, c)` helpers

## Step 14 — Power Ups
- **💣 Bomb** — clears 3×3 area, respects Shield, locked for first 5 moves
- **❄️ Freeze** — marks next player as frozen, they skip their turn
- **🛡️ Shield** — marks player as shielded, bomb skips their cells
- Each power-up limited to 1 use per player

## Step 15 — Move History
- Side panel logs every move in real time
- Each entry shows: player, row, col, action
- Newest entry appears at top

## Step 16 — Leaderboard
- Shows after game ends
- Players sorted by score descending
- Medal emojis 🥇🥈🥉4️⃣ for rankings

## Step 17 — Winner Screen
- Full screen popup when someone wins
- Season image covers entire screen as background
- Winner season name displayed in large text
- Button leads to leaderboard

## Step 18 — Intro Splash Screen
- `intro.png` shown for 3 seconds on page load
- Fades out with CSS opacity transition
- Thriller sound plays on load using Web Audio API

## Step 19 — Rules Screen
- Shows before player count selection
- Lists all game rules and power-up descriptions
- Click "Let's Play" to proceed

## Step 20 — Layout and Styling
- Background image covers full viewport
- Grid on left side, side panel on right
- Title fixed at top center
- Season-colored scores in side panel
- Responsive for mobile screens

---

## Bugs Fixed

| Bug | Fix |
|-----|-----|
| Page crash on load | `pause-btn` addEventListener removed — button was in hidden div |
| Portal orbs not teleporting | Intercepted placement before grid update in `else` block |
| Win not triggering after bomb | Added `checkWin()` inside bomb handler |
| Leaderboard showing during game | Changed CSS default from `display:flex` to `display:none` |
| Turn timer not pausing | Added `clearInterval` guard in `startGameTimer` |
| p3/p4 coloring cell not orbs | Fixed CSS selector to `.cell.p3 .orb` |
| Duplicate `showWinPopup` function | Deleted first definition, kept second |
| Setup screen showing with rules | Added `style="display:none"` to setup-screen |

---

*Built for Delta Task 1 by Joliene* 🌿

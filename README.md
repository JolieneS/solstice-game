# 🌿 SOLSTICE — Chain Reaction Strategy Game

A browser-based multiplayer strategy game built with vanilla JavaScript, HTML, and CSS.
Players choose a season, then take turns placing orbs on a 6×12 grid — triggering explosions,
chain reactions, and power-ups to outlast every opponent.

---

## 🔗 Live Demo
**Play here:** https://jolienes.github.io/solstice-game

---

## 🖼️ Screenshots
<img width="1772" height="967" alt="Screenshot 2026-05-16 214549" src="https://github.com/user-attachments/assets/cf4fdadd-6693-40e3-af93-e5025cba1c8d" />
<img width="1204" height="393" alt="Screenshot 2026-05-16 214605" src="https://github.com/user-attachments/assets/379d8ff2-7516-4f12-bafc-b4ab781a3d25" />
<img width="1414" height="412" alt="Screenshot 2026-05-16 214619" src="https://github.com/user-attachments/assets/fbb7bd50-e66e-4c73-84c4-dfe6e9ae89cf" />
<img width="1090" height="950" alt="Screenshot 2026-05-16 214633" src="https://github.com/user-attachments/assets/7e7c4c43-956d-4083-af76-4b6c6e0565eb" />
<img width="942" height="597" alt="Screenshot 2026-05-16 214650" src="https://github.com/user-attachments/assets/c869985a-cd5e-4bee-b2c6-72cbec69570d" />
<img width="1108" height="620" alt="Screenshot 2026-05-16 214700" src="https://github.com/user-attachments/assets/a83dce5f-cc28-4876-b0cf-3d5ddd06529b" />

---

## 🎮 How to Play

1. Watch the intro splash screen
2. Read the rules on the rules screen
3. Choose number of players (2–4)
4. Each player picks a season
5. First move: place anywhere on the board
6. After that: only place on cells you already own
7. When a cell fills up it explodes outward to neighbours
8. Chain reactions can sweep the board
9. Last player with orbs on the board wins!

### Cell Capacity
| Position | Capacity |
|----------|----------|
| Corner   | 2 orbs   |
| Edge     | 3 orbs   |
| Middle   | 4 orbs   |

---

## ✨ Features

- 2–4 player multiplayer
- Season themes — ❄️ Winter ☀️ Summer 🌧️ Monsoon 🍂 Autumn
- Chain reaction explosion engine
- 🌀 Portal cells — teleport orbs across the board
- 💣 Bomb — clears 3×3 area (unlocks after 5 moves)
- ❄️ Freeze — skips next player's turn
- 🛡️ Shield — protects cells from bombs
- 30-second turn timer + global game timer
- Pause and resume
- Move history panel
- Leaderboard at end of game
- Full screen winner popup with season image
- Intro splash screen with thriller sound
- Responsive design

---

## 🗂️ Project Structure

solstice-game/
├── index.html      — Game layout, all screens, buttons
├── style.css       — All styling, responsive layout
├── game.js         — Game logic, timers, power-ups, rendering
├── audio.js        — Sound effects
├── background.png  — Game background
├── intro.png       — Splash screen image
├── winter.png      — Winter season winner image
├── summer.png      — Summer season winner image
├── monsoon.png     — Monsoon season winner image
└── autumn.png      — Autumn season winner image

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks, no libraries)

---

## 🚀 Running Locally

**Option 1 — VS Code Live Server:**
1. Open folder in VS Code
2. Right click `index.html` → Open with Live Server

**Option 2 — Python:**
```bash
python -m http.server 5500
```
Then open `http://localhost:5500`

---

## 👤 About

Developed by Joliene for Delta Task 1.
Game name: **SOLSTICE** — inspired by the turning of seasons and the cascade of chain reactions.

*Thanks to the Delta Force team for the challenge!* 🌿

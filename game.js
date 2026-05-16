const ROWS = 12;
const COLS = 6;
const gridEl = document.getElementById("grid");
let grid = [];
let gameSeconds = 0;
let turnSeconds = 30;
let gameTimerInterval = null;
let turnTimerInterval = null;
let totalMoves = 0;
let currentPlayer = 1;
let numPlayers = 2;
let firstMove = [null, true, true, true, true];
let scores = [null, 0, 0, 0, 0];
let isPaused = false;
let playerSeasons = [null, null, null, null, null]; // index = player number
let seasonPickIndex = 1;
let bombMode = false;
let bombsLeft = [null, 1, 1, 1, 1];
let moveHistory = []; // each player gets 1 bomb
let frozenPlayers = [null, false, false, false, false];
let freezesLeft = [null, 1, 1, 1, 1];
let shieldActive = [null, false, false, false, false];
let shieldsLeft = [null, 1, 1, 1, 1];
let lastWinner = 0;

for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
        grid[r][c] = { owner: 0, count: 0 };
    }
}

for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', handleClick);
        gridEl.appendChild(cell);
    }
}

const SEASONS = {
    winter: { emoji: '❄️', label: 'Winter', bg: '#d6eaf8' },
    summer: { emoji: '☀️', label: 'Summer', bg: '#fdebd0' },
    monsoon: { emoji: '🌧️', label: 'Monsoon', bg: '#d5f5e3' },
    autumn: { emoji: '🍂', label: 'Autumn', bg: '#fae5d3' }
};

const PORTALS = [
    { a: [2, 1], b: [9, 4] },   // Portal pair 1
    { a: [5, 0], b: [6, 5] },   // Portal pair 2
];


function handleClick(e) {

    if (isPaused) return;

    const cellElement = e.target.closest('.cell');
    const r = parseInt(cellElement.dataset.row);
    const c = parseInt(cellElement.dataset.col);
    const cellData = grid[r][c];

if (frozenPlayers[currentPlayer]) {
    frozenPlayers[currentPlayer] = false;
    currentPlayer = (currentPlayer % numPlayers) + 1;
    updateTurnIndicator();
    return;
}

    if (bombMode) {
    if (bombsLeft[currentPlayer] <= 0) return;
    clearRadius(r, c);
    bombsLeft[currentPlayer]--;
    bombMode = false;
    document.getElementById('bomb-btn').classList.remove('active');
    renderBoard();
updateScores();

const winner = checkWin();
if (winner !== 0) {
    clearInterval(gameTimerInterval);
    clearInterval(turnTimerInterval);
    playSound('win');
    setTimeout(() => showWinPopup(winner), 100);
    return;
}

currentPlayer = (currentPlayer % numPlayers) + 1;
updateTurnIndicator();
startTurnTimer();
return;
}
   const isFirstMove = firstMove[currentPlayer];

    if (!isFirstMove && cellData.owner !== currentPlayer) {
        return; 
    }
    
    if (isFirstMove && cellData.owner !== 0) {
    return;
}
if (isFirstMove && isPortal(r, c)) {
    return; 
}

    if (isFirstMove) {
       
        cellData.count = getCapacity(r, c) - 1;
        cellData.owner = currentPlayer;
        
        firstMove[currentPlayer] = false;
    } 
    else {
    if (isPortal(r, c) && cellData.count === 0) {
        
        const linked = getLinkedPortal(r, c);
        if (linked) {
            const [lr, lc] = linked;
            grid[lr][lc].count += 1;
            grid[lr][lc].owner = currentPlayer;
            scores[currentPlayer]++;
        }
    } else {
        
        cellData.count += 1;
        cellData.owner = currentPlayer;
        scores[currentPlayer]++;
    }
}

    totalMoves++;
    playSound('place');
logMove(currentPlayer, r, c, isFirstMove ? ' first' : ' placed');

   
if (isPortal(r, c)) {
    const linkedPortal = getLinkedPortal(r, c);
    if (linkedPortal) {
        const [lr, lc] = linkedPortal;
        grid[r][c].count = 0;
        grid[r][c].owner = 0;
        grid[lr][lc].count += 1;
        grid[lr][lc].owner = currentPlayer;
        processChain(currentPlayer);
        renderBoard();
        updateScores();
        const winner = checkWin();
        if (winner !== 0) {
            clearInterval(gameTimerInterval);
            clearInterval(turnTimerInterval);
            playSound('win');
            setTimeout(() => showWinPopup(winner), 100);
            return;
        }
        currentPlayer = (currentPlayer % numPlayers) + 1;
        updateTurnIndicator();
        startTurnTimer();
        return;
    }
}

processChain(currentPlayer);
renderBoard();
    updateScores();

    const winner = checkWin();
    if (winner !== 0) {
        clearInterval(gameTimerInterval);
        clearInterval(turnTimerInterval);
        playSound('win');
        setTimeout(() => showWinPopup(winner), 100);
        return;
    }

   currentPlayer = (currentPlayer % numPlayers) + 1;
    updateTurnIndicator();
    startTurnTimer();
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const data = grid[r][c];

        cell.innerHTML = '';
        cell.classList.remove('p1', 'p2', 'p3', 'p4');
        if (isPortal(r, c)) {
    cell.classList.add('portal');
} else {
    cell.classList.remove('portal');
}

        if (data.count > 0) {
            cell.classList.add('p' + data.owner);
            for (let i = 0; i < data.count; i++) {
                const orb = document.createElement('div');
                orb.classList.add('orb');
                const season = playerSeasons[data.owner];
                orb.textContent = season ? SEASONS[season].emoji : '●';
                cell.appendChild(orb);
            }
        }
    });
}

function updateTurnIndicator() {
    document.getElementById('turn').textContent = `Player ${currentPlayer}'s Turn`;
}

function getCapacity(r, c) {
    let neighbours = 0;
    if (r > 0) neighbours++;
    if (r < ROWS - 1) neighbours++;
    if (c > 0) neighbours++;
    if (c < COLS - 1) neighbours++;
    return neighbours;
}

function explode(r, c, player) {
    grid[r][c].count = 0;
    grid[r][c].owner = 0;
    playSound('explode');

    const neighbours = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
    neighbours.forEach(([nr, nc]) => {
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            const neighbourLinked = getLinkedPortal(nr, nc);
            if (neighbourLinked && grid[nr][nc].count === 0) {
                const [lr, lc] = neighbourLinked;
                grid[lr][lc].count += 1;
                grid[lr][lc].owner = player;
            } else {
                grid[nr][nc].count += 1;
                grid[nr][nc].owner = player;
            }
            if (grid[nr][nc].owner !== 0 && grid[nr][nc].owner !== player) {
                scores[player]++;
            }
        }
    });
}
function processChain(player) {
    let exploded = true;
    while (exploded) {
        exploded = false;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c].count >= getCapacity(r, c)) {
                    explode(r, c, player);
                    exploded = true;
                }
            }
        }
    }
}

function checkWin() {
    if (totalMoves < numPlayers + 1) return 0;

    let cellCounts = [null, 0, 0, 0, 0];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let owner = grid[r][c].owner;
            if (owner !== 0) cellCounts[owner]++;
        }
    }

    let activePlayers = [];
    for (let p = 1; p <= numPlayers; p++) {
        if (!firstMove[p]) { 
            if (cellCounts[p] > 0) activePlayers.push(p);
        }
    }

    if (activePlayers.length === 1) return activePlayers[0];
    return 0;
}

function updateScores() {
    const container = document.getElementById('scores-container');
    container.innerHTML = '';
    for (let p = 1; p <= numPlayers; p++) {
        const div = document.createElement('div');
        div.id = 'score' + p;
        div.textContent = 'P' + p + ': ' + scores[p];
        div.classList.add('score-item', 'p' + p + '-color');
        container.appendChild(div);
    }
}

function startGameTimer() {
    clearInterval(gameTimerInterval); 
    gameTimerInterval = setInterval(() => {
        gameSeconds++;
        document.getElementById('game-timer').textContent = 'Game Time: ' + gameSeconds + 's';
    }, 1000);
}

function startTurnTimer() {
    clearInterval(turnTimerInterval);
    turnSeconds = 30;
    document.getElementById('turn-timer').textContent = 'Turn Time: 30s';

    turnTimerInterval = setInterval(() => {
        turnSeconds--;
        document.getElementById('turn-timer').textContent = 'Turn Time: ' + turnSeconds + 's';
        if (turnSeconds <= 0) {
            clearInterval(turnTimerInterval);
            currentPlayer = (currentPlayer % numPlayers) + 1;
            updateTurnIndicator();
            startTurnTimer();
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');

    if (isPaused) {
        clearInterval(gameTimerInterval);
        clearInterval(turnTimerInterval);
        btn.textContent = ' Click to resume';
        gridEl.style.pointerEvents = 'none';
        gridEl.style.opacity = '0.5';
    } else {
        startGameTimer();
        startTurnTimer();
        btn.textContent = ' Pause';
        gridEl.style.pointerEvents = 'auto';
        gridEl.style.opacity = '1';
    }
}

function restartGame() {
    // reset grid array
    isPaused = false;
    document.getElementById('pause-btn').textContent = '⏸ Pause';
    gridEl.style.pointerEvents = 'auto';
    gridEl.style.opacity = '1';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = { owner: 0, count: 0 };
        }
    }
    currentPlayer = 1;
    totalMoves = 0;
    scores = [null, 0, 0, 0, 0];
    firstMove = [null, true, true, true, true];

    frozenPlayers = [null, false, false, false, false];
freezesLeft = [null, 1, 1, 1, 1];

shieldActive = [null, false, false, false, false];
shieldsLeft = [null, 1, 1, 1, 1];

    clearInterval(gameTimerInterval);
    clearInterval(turnTimerInterval);
    gameSeconds = 0;

    moveHistory = [];
    document.getElementById('history-list').innerHTML = '';

    // update screen
    renderBoard();
    updateScores();
    updateTurnIndicator();
    startGameTimer();
    startTurnTimer();

    startGameTimer();
    startTurnTimer();

    bombsLeft = [null, 1, 1, 1, 1];
    bombMode = false;
    document.getElementById('bomb-btn').classList.remove('active');
}

function startGame(n) {
    numPlayers = n;
    seasonPickIndex = 1;
    playerSeasons = [null, null, null, null, null];

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('season-screen').style.display = 'block';
    document.getElementById('season-prompt').textContent = 'Player 1 — Pick your season';
}

function pickSeason(season) {
    playerSeasons[seasonPickIndex] = season;
    seasonPickIndex++;

    if (seasonPickIndex > numPlayers) {
        document.getElementById('season-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        restartGame();
    } else {
        // Next player picks
        document.getElementById('season-prompt').textContent = 
            'Player ' + seasonPickIndex + ' — Pick your season';
    }
}

function isPortal(r, c) {
    for (let portal of PORTALS) {
        if ((portal.a[0] === r && portal.a[1] === c) ||
            (portal.b[0] === r && portal.b[1] === c)) {
            return true;
        }
    }
    return false;
}

function getLinkedPortal(r, c) {
    for (let portal of PORTALS) {
        if (portal.a[0] === r && portal.a[1] === c) return portal.b;
        if (portal.b[0] === r && portal.b[1] === c) return portal.a;
    }
    return null;
}

function activateBomb() {
    if (totalMoves < 5) { alert('⚠️ Power ups unlock after 5 moves!'); return; }
    if (bombsLeft[currentPlayer] <= 0) return;
    bombMode = !bombMode;
    const btn = document.getElementById('bomb-btn');
    btn.classList.toggle('active', bombMode);
}

function clearRadius(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const cellOwner = grid[nr][nc].owner;
                if (cellOwner !== 0 && shieldActive[cellOwner]) continue;
                grid[nr][nc].count = 0;
                grid[nr][nc].owner = 0;
            }
        }
    }
    playSound('explode');
}

function logMove(player, r, c, action) {
    moveHistory.push({ player, r, c, action });
    const list = document.getElementById('history-list');
    const entry = document.createElement('div');
    entry.classList.add('history-entry', 'p' + player + '-color');
    entry.textContent = `P${player} → (${r},${c}) ${action}`;
    list.prepend(entry);
}

function showLeaderboard(winner) {
    let players = [];
    for (let p = 1; p <= numPlayers; p++) {
        const season = playerSeasons[p];
        const emoji = season ? SEASONS[season].emoji : '🏆';
        players.push({ player: p, score: scores[p], emoji });
    }

    players.sort((a, b) => b.score - a.score);

    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    players.forEach((p, index) => {
        const entry = document.createElement('div');
        entry.classList.add('leaderboard-entry', 'p' + p.player + '-color');
        if (index === 0) entry.classList.add('first');

        const rank = ['🥇', '🥈', '🥉', '4️⃣'][index];
        entry.textContent = `${rank} ${p.emoji} Player ${p.player} — ${p.score} pts`;
        list.appendChild(entry);
    });

    document.getElementById('leaderboard-screen').style.display = 'flex';
}

function backToSetup() {
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
}

function showSetup() {
    document.getElementById('rules-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
}

function activateFreeze() {
    if (totalMoves < 5) { alert('⚠️ Power ups unlock after 5 moves!'); return; }
    if (freezesLeft[currentPlayer] <= 0) return;
    const nextPlayer = (currentPlayer % numPlayers) + 1;
    frozenPlayers[nextPlayer] = true;
    freezesLeft[currentPlayer]--;
    alert('❄️ Player ' + nextPlayer + ' is frozen for 1 turn!');
}

function activateShield() {
    if (totalMoves < 5) { alert('⚠️ Power ups unlock after 5 moves!'); return; }
    if (shieldsLeft[currentPlayer] <= 0) return;
    shieldActive[currentPlayer] = true;
    shieldsLeft[currentPlayer]--;
    alert('🛡️ Shield active for Player ' + currentPlayer + '!');
}

function showWinPopup(winner) {
    lastWinner = winner;
    const season = playerSeasons[winner];
    const seasonLabel = season ? SEASONS[season].label : 'Player ' + winner;
    const imgSrc = season ? season + '.png' : '';

    document.getElementById('win-image').src = imgSrc;
    document.getElementById('win-title').textContent = seasonLabel;

    document.getElementById('win-leaderboard-btn').onclick = function() {
        document.getElementById('win-popup').style.display = 'none';
        showLeaderboard(lastWinner);
    };

    document.getElementById('win-popup').style.display = 'flex';
}


window.addEventListener('load', () => {
    playIntroSound();
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        intro.style.opacity = '0';
        setTimeout(() => intro.style.display = 'none', 1000);
    }, 3000);
});
// Word pool database for the innocent players
const wordList = [
    "Apple", "Banana", "Coffee", "Laptop", "Bitcoin", 
    "Hollywood", "Spaghetti", "Football", "Spaceship", "Library",
    "Elevator", "Microscope", "Subway", "Helicopter", "Campfire"
];

// Game State Variables
let totalPlayers = 3;
let imposterCount = 1;
let playersRoles = []; 
let currentWord = "";
let currentPlayerIndex = 0;
let isRevealed = false;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const passScreen = document.getElementById('pass-screen');
const revealScreen = document.getElementById('reveal-screen');
const gameOverScreen = document.getElementById('game-over-screen');

const totalPlayersSelect = document.getElementById('total-players');
const imposterCountSelect = document.getElementById('imposter-count');
const startBtn = document.getElementById('start-btn');
const errorMsg = document.getElementById('error-msg');

const playerTurnTitle = document.getElementById('player-turn-title');
const playerNameSpan = document.getElementById('player-name-span');
const confirmPassBtn = document.getElementById('confirm-pass-btn');

const revealTitle = document.getElementById('reveal-title');
const secretBox = document.getElementById('secret-box');
const doneRevealBtn = document.getElementById('done-reveal-btn');
const restartBtn = document.getElementById('restart-btn');

// Populate dynamic dropdown options (3 to 15 players)
function initSetupOptions() {
    for (let i = 3; i <= 15; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        totalPlayersSelect.appendChild(opt);
    }
    for (let i = 1; i <= 5; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        imposterCountSelect.appendChild(opt);
    }
}

// Validate setup configurations
function validateSetup() {
    const p = parseInt(totalPlayersSelect.value);
    const imp = parseInt(imposterCountSelect.value);
    
    if (imp >= p - 1) {
        errorMsg.innerText = `Too many imposters! Max allowed for ${p} players is ${p - 2}.`;
        errorMsg.style.display = 'block';
        return false;
    }
    errorMsg.style.display = 'none';
    totalPlayers = p;
    imposterCount = imp;
    return true;
}

// Set up roles assignment array
function setupGameData() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    playersRoles = [];
    
    for (let i = 0; i < totalPlayers; i++) {
        playersRoles.push({ id: i + 1, isImposter: false, word: currentWord });
    }

    let assignedImposters = 0;
    while (assignedImposters < imposterCount) {
        let randIndex = Math.floor(Math.random() * totalPlayers);
        if (!playersRoles[randIndex].isImposter) {
            playersRoles[randIndex].isImposter = true;
            playersRoles[randIndex].word = "IMPOSTER";
            assignedImposters++;
        }
    }
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startPassingLoop() {
    currentPlayerIndex = 0;
    goToPassScreen();
}

function goToPassScreen() {
    isRevealed = false;
    secretBox.className = "secret-box";
    secretBox.innerHTML = `<span>Tap to reveal your secret</span><span class="tap-prompt">(Hold or tap to see)</span>`;
    doneRevealBtn.disabled = true;

    playerTurnTitle.innerText = `Player ${playersRoles[currentPlayerIndex].id}`;
    playerNameSpan.innerText = `Player ${playersRoles[currentPlayerIndex].id}`;
    showScreen(passScreen);
}

function goToRevealScreen() {
    revealTitle.innerText = `Player ${playersRoles[currentPlayerIndex].id}`;
    showScreen(revealScreen);
}

function handleRevealTap() {
    if (!isRevealed) {
        isRevealed = true;
        const player = playersRoles[currentPlayerIndex];
        
        if (player.isImposter) {
            secretBox.classList.add('revealed', 'imposter');
            secretBox.innerHTML = `You are the IMPOSTER!<br><span style="font-size:0.9rem; font-weight:normal; color:#fca5a5; margin-top:5px; display:block;">Blend in and try to guess the secret word.</span>`;
        } else {
            secretBox.classList.add('revealed', 'innocent');
            secretBox.innerHTML = `Secret Word:<br><span style="font-size:1.8rem; display:block; margin-top:5px;">${player.word}</span>`;
        }
        doneRevealBtn.disabled = false;
    }
}

function handleNextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex < totalPlayers) {
        goToPassScreen();
    } else {
        showScreen(gameOverScreen);
    }
}

// UI Event Listeners
startBtn.addEventListener('click', () => {
    if (validateSetup()) {
        setupGameData();
        startPassingLoop();
    }
});

totalPlayersSelect.addEventListener('change', validateSetup);
imposterCountSelect.addEventListener('change', validateSetup);
confirmPassBtn.addEventListener('click', goToRevealScreen);
secretBox.addEventListener('click', handleRevealTap);
doneRevealBtn.addEventListener('click', handleNextPlayer);
restartBtn.addEventListener('click', () => showScreen(setupScreen));

// Fire layout logic on page load
initSetupOptions();

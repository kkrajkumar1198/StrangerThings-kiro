// Audio setup - Upside Down theme
const audio = new Audio('the-upside-down---stranger-things-ost-(short)-made-with-Voicemod.mp3');
audio.loop = true;
audio.volume = 0.3;
audio.autoplay = true;

let audioStarted = false;
audio.play().then(() => {
    audioStarted = true;
}).catch(() => {
    document.addEventListener('click', () => {
        if (!audioStarted) {
            audio.play();
            audioStarted = true;
        }
    }, { once: true });
});

const audioToggle = document.getElementById('audio-toggle');
let isMuted = false;

audioToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    const icon = audioToggle.querySelector('.audio-icon');
    icon.textContent = isMuted ? '✕' : '♪';
});

// Custom cursor
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(50, 139, 0, 0.5);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(50, 139, 0, 0.8);
`;
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Game logic
const mazeGrid = document.getElementById('mazeGrid');
const movesDisplay = document.getElementById('moves');
const safeTilesDisplay = document.getElementById('safeTiles');
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');

let moves = 0;
let safeTilesFound = 0;
const totalSafeTiles = 12;
let gameOver = false;

// Generate maze (6x6 grid = 36 tiles, 12 safe, 24 danger)
let safeTiles = [];

// Demogorgon scare function
function showDemogorgonScare() {
    // Stop background music
    audio.pause();
    
    // Create fullscreen overlay
    const scareOverlay = document.createElement('div');
    scareOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add demogorgon gif
    const demogorgonImg = document.createElement('img');
    demogorgonImg.src = 'demogorgon-roar.gif';
    demogorgonImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;
    
    scareOverlay.appendChild(demogorgonImg);
    document.body.appendChild(scareOverlay);
    
    // Play demogorgon scream
    const scream = new Audio('demogorgon%20scream.mp3');
    scream.volume = 1.0; // Maximum volume
    scream.play().catch(e => console.log('Scream failed'));
    
    // Allow reset after 3 seconds
    setTimeout(() => {
        scareOverlay.style.cursor = 'pointer';
        scareOverlay.addEventListener('click', () => {
            document.body.removeChild(scareOverlay);
            audio.play();
            resetGame();
        });
        
        // Add text prompt
        const prompt = document.createElement('div');
        prompt.textContent = 'Click to try again...';
        prompt.style.cssText = `
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            color: #328b00;
            font-size: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            animation: blink 1s ease-in-out infinite;
        `;
        scareOverlay.appendChild(prompt);
        
        // Add blink animation
        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(blinkStyle);
    }, 3000);
}

function generateMaze() {
    safeTiles = [];
    const allPositions = Array.from({ length: 36 }, (_, i) => i);
    
    // Shuffle and pick 12 safe tiles
    for (let i = allPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }
    
    safeTiles = allPositions.slice(0, totalSafeTiles);
}

function createMazeGrid() {
    mazeGrid.innerHTML = '';
    
    for (let i = 0; i < 36; i++) {
        const tile = document.createElement('div');
        tile.className = 'maze-tile';
        tile.dataset.index = i;
        tile.addEventListener('click', () => revealTile(tile, i));
        mazeGrid.appendChild(tile);
    }
}

function revealTile(tile, index) {
    if (gameOver || tile.classList.contains('revealed')) return;
    
    moves++;
    movesDisplay.textContent = moves;
    tile.classList.add('revealed');
    
    if (safeTiles.includes(index)) {
        // Safe tile
        tile.classList.add('safe');
        tile.textContent = '🌿';
        safeTilesFound++;
        safeTilesDisplay.textContent = safeTilesFound;
        
        // Play success sound
        const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        successSound.volume = 0.15;
        successSound.play().catch(e => console.log('Sound failed'));
        
        // Check win condition
        if (safeTilesFound === totalSafeTiles) {
            gameOver = true;
            gameStatus.textContent = '✓ Path Clear! You navigated the tunnels!';
            gameStatus.className = 'game-status success';
            
            // Reveal all remaining tiles
            setTimeout(() => {
                document.querySelectorAll('.maze-tile:not(.revealed)').forEach((t, i) => {
                    setTimeout(() => {
                        t.classList.add('revealed', 'danger');
                        t.textContent = '☠️';
                    }, i * 50);
                });
            }, 500);
        }
    } else {
        // Danger tile
        tile.classList.add('danger');
        tile.textContent = '☠️';
        gameOver = true;
        gameStatus.textContent = '✗ The vines consumed you...';
        gameStatus.className = 'game-status failure';
        
        // Play failure sound
        const failSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        failSound.volume = 0.2;
        failSound.play().catch(e => console.log('Sound failed'));
        
        // Show demogorgon scare after brief delay
        setTimeout(() => {
            showDemogorgonScare();
        }, 1500);
    }
}

function resetGame() {
    moves = 0;
    safeTilesFound = 0;
    gameOver = false;
    movesDisplay.textContent = '0';
    safeTilesDisplay.textContent = '0';
    gameStatus.textContent = '';
    gameStatus.className = 'game-status';
    
    generateMaze();
    createMazeGrid();
}

// Reset button
resetBtn.addEventListener('click', resetGame);

// Initialize game
resetGame();

// Add floating particles
function createParticles() {
    const container = document.querySelector('.tunnels-container');
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, transparent, rgba(50, 139, 0, 0.5), transparent);
            pointer-events: none;
            left: ${Math.random() * 100}%;
            bottom: 0;
            animation: particle-float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

createParticles();

// Audio setup
const audio = new Audio('Stranger%20Things.mp3');
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
    audioToggle.textContent = isMuted ? '🔇' : '🔊';
});

// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'cursor';
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

// Advanced Pattern Recognition Puzzle - DIFFICULT
const puzzles = [
    {
        patterns: [
            '1→1→2→3→5→8',
            '2→3→5→7→11→13',
            '1→4→9→16→25→36',
            '3→6→12→24→48→96'
        ],
        correctIndex: 0,
        hint: 'Advanced sequences - Fibonacci vs others'
    },
    {
        patterns: [
            '◐◑◒◓◐◑◒◓',
            '■□▨▧■□▨▧',
            '●○◐◑●○◐◑',
            '▲▼◄►▲▼◄▶'
        ],
        correctIndex: 3,
        hint: 'Rotational patterns - one has inconsistent rotation'
    },
    {
        patterns: [
            'A1→B2→C3→D4',
            'Z26→Y25→X24→W23',
            'M13→N14→O15→P16',
            'F6→G7→I9→J10'
        ],
        correctIndex: 3,
        hint: 'Alphanumeric sequences - one skips a letter'
    },
    {
        patterns: [
            '2→4→16→256',
            '3→9→81→6561',
            '5→25→625→15625',
            '4→16→256→4096'
        ],
        correctIndex: 3,
        hint: 'Exponential growth - one breaks the pattern'
    },
    {
        patterns: [
            '■●■▲●■▲■●',
            '▲■▲●■▲●▲■',
            '●▲●■▲●■●▲',
            '■▲■●▲■●■▲'
        ],
        correctIndex: 2,
        hint: 'Complex sequences - one has wrong symbol placement'
    }
];

let currentPuzzle = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let timeLeft = 30;
let timerInterval = null;
const patternsGrid = document.getElementById('patterns-grid');
const statusMessage = document.getElementById('status-message');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const wrongCountDisplay = document.getElementById('wrong-count');

// Click sound
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
clickSound.volume = 0.3;

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
    
    // Redirect after 3 seconds
    setTimeout(() => {
        window.location.href = 'laboratory.html';
    }, 3000);
}

function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timeLeft = 30;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    timerDisplay.style.color = '#00ff00';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        
        // Change color as time runs out
        if (timeLeft <= 10) {
            timerDisplay.style.color = '#ff4444';
            timerDisplay.style.animation = 'timer-pulse 0.5s ease-in-out infinite';
        } else if (timeLeft <= 20) {
            timerDisplay.style.color = '#ffaa00';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    wrongAnswers++;
    wrongCountDisplay.textContent = wrongAnswers;
    
    // Disable all cards
    document.querySelectorAll('.pattern-card').forEach(c => {
        c.style.pointerEvents = 'none';
    });
    
    statusMessage.textContent = 'TIME OUT!';
    statusMessage.className = 'status-message error';
    
    if (wrongAnswers >= 2) {
        setTimeout(() => {
            statusMessage.textContent = 'ACCESS DENIED - Too many failures';
            setTimeout(() => {
                showDemogorgonScare();
            }, 1500);
        }, 1000);
    } else {
        setTimeout(() => {
            currentPuzzle++;
            if (currentPuzzle < puzzles.length) {
                loadPuzzle();
            } else {
                statusMessage.textContent = 'ACCESS DENIED - Insufficient correct answers';
                setTimeout(() => {
                    showDemogorgonScare();
                }, 1500);
            }
        }, 1500);
    }
}

function loadPuzzle() {
    patternsGrid.innerHTML = '';
    statusMessage.textContent = '';
    nextBtn.style.display = 'none';
    
    const puzzle = puzzles[currentPuzzle];
    
    // Update progress
    const progressText = document.querySelector('.puzzle-progress');
    if (progressText) {
        progressText.textContent = `Challenge ${currentPuzzle + 1} of ${puzzles.length}`;
    }
    
    // Update hint
    const hintText = document.querySelector('.puzzle-hint');
    if (hintText) {
        hintText.textContent = puzzle.hint;
    }
    
    // Start timer
    startTimer();
    
    puzzle.patterns.forEach((pattern, index) => {
        const card = document.createElement('div');
        card.className = 'pattern-card';
        card.innerHTML = `<div class="pattern-content">${pattern}</div>`;
        
        card.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Click sound failed'));
            
            checkAnswer(index, card);
        });
        
        patternsGrid.appendChild(card);
    });
}

function checkAnswer(selectedIndex, card) {
    const puzzle = puzzles[currentPuzzle];
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Disable all cards
    document.querySelectorAll('.pattern-card').forEach(c => {
        c.style.pointerEvents = 'none';
    });
    
    if (selectedIndex === puzzle.correctIndex) {
        card.classList.add('correct');
        statusMessage.textContent = 'CORRECT!';
        statusMessage.className = 'status-message success';
        correctAnswers++;
        
        // Automatically move to next question after 1 second
        setTimeout(() => {
            if (currentPuzzle < puzzles.length - 1) {
                currentPuzzle++;
                loadPuzzle();
            } else {
                // All puzzles completed
                statusMessage.textContent = 'ACCESS GRANTED - Entering Lab...';
                setTimeout(() => {
                    window.location.href = 'laboratory.html';
                }, 1500);
            }
        }, 1000);
    } else {
        card.classList.add('wrong');
        wrongAnswers++;
        wrongCountDisplay.textContent = wrongAnswers;
        statusMessage.textContent = 'INCORRECT!';
        statusMessage.className = 'status-message error';
        
        // Check if too many wrong answers
        if (wrongAnswers >= 2) {
            setTimeout(() => {
                statusMessage.textContent = 'ACCESS DENIED - Too many failures';
                setTimeout(() => {
                    showDemogorgonScare();
                }, 1500);
            }, 1000);
        } else {
            // Move to next question after showing error
            setTimeout(() => {
                currentPuzzle++;
                if (currentPuzzle < puzzles.length) {
                    loadPuzzle();
                } else {
                    statusMessage.textContent = 'ACCESS DENIED - Insufficient correct answers';
                    setTimeout(() => {
                        showDemogorgonScare();
                    }, 1500);
                }
            }, 1500);
        }
    }
}

// Load first puzzle
loadPuzzle();

// Audio setup
const audio = new Audio('Stranger%20Things.mp3');
audio.loop = true;
audio.volume = 0.15;
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
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(139, 0, 0, 0.5);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(139, 0, 0, 0.8);
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

// Vecna presence follows mouse
const vecnaPresence = document.getElementById('vecnaPresence');
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 50;
    const y = (e.clientY / window.innerHeight - 0.5) * 50;
    vecnaPresence.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

// Scroll-based opacity for Vecna presence
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    vecnaPresence.style.opacity = 0.3 + (scrollPercent * 0.4);
});

// Crack propagation on scroll
const crack1 = document.getElementById('crack1');
const crack2 = document.getElementById('crack2');
const crack3 = document.getElementById('crack3');

function generateCrackPath(startX, startY, segments) {
    let path = `M ${startX} ${startY}`;
    let x = startX;
    let y = startY;
    
    for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * 100;
        y += Math.random() * 100;
        path += ` L ${x} ${y}`;
    }
    
    return path;
}

window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollPercent > 0.2 && crack1.getAttribute('d') === 'M 0 0') {
        crack1.setAttribute('d', generateCrackPath(window.innerWidth * 0.3, 0, 8));
    }
    if (scrollPercent > 0.5 && crack2.getAttribute('d') === 'M 0 0') {
        crack2.setAttribute('d', generateCrackPath(window.innerWidth * 0.7, 0, 10));
    }
    if (scrollPercent > 0.8 && crack3.getAttribute('d') === 'M 0 0') {
        crack3.setAttribute('d', generateCrackPath(window.innerWidth * 0.5, window.innerHeight * 0.3, 12));
    }
});

// Memory cards with audio
const memoryCards = document.querySelectorAll('.memory-card');

memoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const audio = card.querySelector('.memory-audio');
        if (audio) {
            audio.volume = 0.2;
            audio.play().catch(e => console.log('Audio failed'));
        }
        
        // Subtle card flip sound effect
        const flipSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        flipSound.volume = 0.08;
        flipSound.play().catch(e => console.log('Flip sound failed'));
    });
    
    card.addEventListener('mouseleave', () => {
        const audio = card.querySelector('.memory-audio');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
});

// Sinister choice puzzle
const choiceButtons = document.querySelectorAll('.choice-btn');
const choiceResult = document.getElementById('choiceResult');

const responses = {
    '1': "Vecna feeds on your fear of being forgotten. He shows you a world where you never existed... Your friends don't remember you. You were never there.",
    '2': "You fear losing control. Vecna takes it from you. Your body moves without your command. You are a puppet in his twisted show.",
    '3': "Eternal isolation... Vecna's favorite. He traps you in a void where time has no meaning. Alone. Forever. Screaming into nothing.",
    '4': "Your past haunts you. Vecna brings every regret, every mistake, every moment of shame flooding back. You cannot escape what you've done."
};

choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        
        // Disable all buttons
        choiceButtons.forEach(b => b.disabled = true);
        
        // Show result with delay
        setTimeout(() => {
            choiceResult.textContent = responses[choice];
            choiceResult.style.animation = 'glitch-effect 0.5s ease-out';
            
            // Play ominous sound
            const ominousSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
            ominousSound.volume = 0.3;
            ominousSound.play().catch(e => console.log('Sound failed'));
            
            // Re-enable after showing result
            setTimeout(() => {
                choiceButtons.forEach(b => b.disabled = false);
                choiceResult.textContent = '';
            }, 5000);
        }, 500);
    });
});

// Timeline hover effects
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const marker = item.querySelector('.timeline-marker');
        marker.style.transform = 'scale(1.2) rotate(360deg)';
        marker.style.transition = 'transform 0.5s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        const marker = item.querySelector('.timeline-marker');
        marker.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Hive node interactions
const hiveNodes = document.querySelectorAll('.hive-node');
const hiveCenter = document.getElementById('hiveCenter');

hiveNodes.forEach(node => {
    node.addEventListener('click', () => {
        // Pulse effect on center
        hiveCenter.style.animation = 'none';
        setTimeout(() => {
            hiveCenter.style.animation = 'hive-pulse 2s ease-in-out infinite';
        }, 10);
        
        // Play connection sound
        const connectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        connectSound.volume = 0.2;
        connectSound.play().catch(e => console.log('Sound failed'));
    });
});

// Resistance game
const resistBtn = document.getElementById('resistBtn');
const resistanceFill = document.getElementById('resistanceFill');
const gameResult = document.getElementById('gameResult');
const vecnaFace = document.getElementById('vecnaFace');

let isResisting = false;
let resistanceLevel = 0;
let gameInterval = null;
let drainInterval = null;

resistBtn.addEventListener('mousedown', () => {
    if (gameResult.textContent) return;
    
    isResisting = true;
    
    // Increase resistance while holding
    gameInterval = setInterval(() => {
        resistanceLevel = Math.min(100, resistanceLevel + 2);
        resistanceFill.style.width = resistanceLevel + '%';
        
        if (resistanceLevel >= 100) {
            winGame();
        }
    }, 50);
});

resistBtn.addEventListener('mouseup', () => {
    isResisting = false;
    clearInterval(gameInterval);
});

resistBtn.addEventListener('mouseleave', () => {
    isResisting = false;
    clearInterval(gameInterval);
});

// Vecna constantly drains resistance
drainInterval = setInterval(() => {
    if (!isResisting && resistanceLevel > 0) {
        resistanceLevel = Math.max(0, resistanceLevel - 1);
        resistanceFill.style.width = resistanceLevel + '%';
        
        if (resistanceLevel <= 0 && gameResult.textContent === '') {
            loseGame();
        }
    }
}, 100);

function winGame() {
    clearInterval(gameInterval);
    clearInterval(drainInterval);
    
    gameResult.textContent = "You resisted Vecna's curse! Your will is stronger than his darkness.";
    gameResult.style.color = '#00ff00';
    resistBtn.disabled = true;
    resistBtn.style.opacity = '0.5';
    
    // Victory sound
    const victorySound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    victorySound.volume = 0.3;
    victorySound.play().catch(e => console.log('Sound failed'));
    
    // Fade out Vecna face
    vecnaFace.style.opacity = '0';
    vecnaFace.style.transition = 'opacity 2s ease';
}

function loseGame() {
    clearInterval(gameInterval);
    clearInterval(drainInterval);
    
    gameResult.textContent = "Vecna's curse consumes you. Your mind is his. Your body is his. You are his.";
    gameResult.style.color = '#ff0000';
    resistBtn.disabled = true;
    resistBtn.style.opacity = '0.5';
    
    // Failure sound
    const failSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    failSound.volume = 0.3;
    failSound.play().catch(e => console.log('Sound failed'));
    
    // Intensify Vecna face
    vecnaFace.style.transform = 'scale(1.5)';
    vecnaFace.style.transition = 'transform 2s ease';
    
    // Screen shake
    document.body.style.animation = 'screen-shake 0.5s ease';
}

// Add screen shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes screen-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Floating particles (decay/skin flakes)
function createParticles() {
    const container = document.querySelector('.vecna-container');
    
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(139, 0, 0, ${Math.random() * 0.5 + 0.3});
            pointer-events: none;
            left: ${Math.random() * 100}%;
            bottom: 0;
            animation: particle-drift ${Math.random() * 15 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            border-radius: 50%;
            z-index: 1;
        `;
        document.body.appendChild(particle);
    }
}

createParticles();

// Random jump scares
function randomJumpScare() {
    if (Math.random() < 0.1) { // 10% chance every interval
        vecnaPresence.style.opacity = '0.9';
        vecnaPresence.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        // Play scare sound
        const scareSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        scareSound.volume = 0.3;
        scareSound.play().catch(e => console.log('Scare sound failed'));
        
        setTimeout(() => {
            vecnaPresence.style.opacity = '0.3';
            vecnaPresence.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
    }
}

// Check for jump scares every 10 seconds
setInterval(randomJumpScare, 10000);

// Ambient whispers
function playAmbientWhisper() {
    if (!isMuted && Math.random() < 0.3) {
        const whisper = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        whisper.volume = 0.1;
        whisper.play().catch(e => console.log('Whisper failed'));
    }
}

setInterval(playAmbientWhisper, 15000);

// Escape button warning
const escapeBtn = document.getElementById('escapeBtn');
escapeBtn.addEventListener('click', (e) => {
    if (!confirm('Are you sure you want to leave? Vecna will remember you...')) {
        e.preventDefault();
    }
});

console.log('%cVecna sees you...', 'color: #8b0000; font-size: 20px; font-weight: bold;');

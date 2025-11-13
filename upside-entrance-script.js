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

// Frequency tuning mechanic
const dial = document.getElementById('frequency-dial');
const freqValue = document.querySelector('.freq-value');
const statusText = document.getElementById('status-text');
const bars = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3')
];

const targetFrequency = 11.0; // Eleven's number
const tolerance = 0.5;
let currentFrequency = 0;
let isDragging = false;
let startAngle = 0;
let currentAngle = 0;
let portalUnlocked = false;

dial.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

function startDrag(e) {
    isDragging = true;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
}

function drag(e) {
    if (!isDragging) return;
    
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    currentAngle += angle - startAngle;
    startAngle = angle;
    
    // Update dial rotation
    dial.style.transform = `rotate(${currentAngle}rad)`;
    
    // Calculate frequency (0-20 Hz range)
    currentFrequency = ((currentAngle % (Math.PI * 2)) / (Math.PI * 2)) * 20;
    if (currentFrequency < 0) currentFrequency += 20;
    
    freqValue.textContent = currentFrequency.toFixed(1);
    
    // Update harmonic bars
    updateHarmonics();
    checkFrequency();
}

function stopDrag() {
    isDragging = false;
}

function updateHarmonics() {
    const proximity = 1 - Math.abs(currentFrequency - targetFrequency) / 10;
    const height = Math.max(0, Math.min(100, proximity * 100));
    
    bars.forEach((bar, index) => {
        const offset = (index - 1) * 10;
        const barHeight = Math.max(0, height + offset);
        bar.style.setProperty('--height', `${barHeight}%`);
        bar.querySelector('::after') || (bar.style.background = `linear-gradient(to top, #8b00ff ${barHeight}%, rgba(139, 0, 255, 0.2) ${barHeight}%)`);
    });
}

function checkFrequency() {
    const diff = Math.abs(currentFrequency - targetFrequency);
    
    if (diff < tolerance && !portalUnlocked) {
        portalUnlocked = true;
        statusText.textContent = 'FREQUENCY LOCKED - Portal Opening...';
        statusText.className = 'status-text success';
        
        // Play success sound
        const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
        successSound.volume = 0.3;
        successSound.play().catch(e => console.log('Sound failed'));
        
        // Show success message and redirect
        setTimeout(() => {
            statusText.textContent = '✓ Portal Unlocked! Redirecting...';
            setTimeout(() => {
                window.location.href = 'central-hub.html';
            }, 1500);
        }, 2000);
    } else if (diff < 2 && !portalUnlocked) {
        statusText.textContent = 'Getting closer... adjust carefully';
    } else if (diff < 5 && !portalUnlocked) {
        statusText.textContent = 'Weak signal detected';
    } else if (!portalUnlocked) {
        statusText.textContent = 'Searching for signal...';
    }
}

// Mysterious objects interaction
const objects = document.querySelectorAll('.object-item');
const messageBox = document.getElementById('message-box');

objects.forEach(obj => {
    obj.addEventListener('click', () => {
        const message = obj.getAttribute('data-message');
        messageBox.textContent = `"${message}"`;
        messageBox.classList.add('show');
        
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 4000);
    });
});

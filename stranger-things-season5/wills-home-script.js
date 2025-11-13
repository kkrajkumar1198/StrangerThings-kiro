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

// Vintage QWERTY Keyboard Layout
const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split('')
];

const alphabetWall = document.querySelector('.alphabet-wall');
const messageDisplay = document.querySelector('.current-message');
let currentMessage = '';

console.log('Alphabet wall element:', alphabetWall);
console.log('Creating keyboard...');

// Light click sound
const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
clickSound.volume = 0.3;

// Create QWERTY keyboard layout
keyboardRows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    row.forEach(letter => {
        const key = document.createElement('div');
        key.className = 'keyboard-key';
        key.setAttribute('data-letter', letter);
        key.textContent = letter;
        
        key.addEventListener('click', () => {
            // Play click sound
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Click sound failed'));
            
            // Light up key
            key.classList.add('active');
            
            // Add letter to message
            currentMessage += letter;
            updateMessage();
            
            // Remove active state after animation
            setTimeout(() => {
                key.classList.remove('active');
            }, 300);
        });
        
        rowDiv.appendChild(key);
    });
    
    alphabetWall.appendChild(rowDiv);
});

function updateMessage() {
    if (currentMessage.length > 0) {
        messageDisplay.textContent = currentMessage;
    } else {
        messageDisplay.textContent = 'Click the lights to spell a message...';
    }
}

// Clear button
document.querySelector('.clear-btn').addEventListener('click', () => {
    currentMessage = '';
    updateMessage();
    
    // Flash all lights briefly
    document.querySelectorAll('.light-bulb').forEach(bulb => {
        bulb.classList.add('active');
        setTimeout(() => bulb.classList.remove('active'), 200);
    });
});

// Preset message buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        currentMessage = '';
        
        // Animate each letter
        message.split('').forEach((letter, index) => {
            setTimeout(() => {
                const bulb = document.querySelector(`[data-letter="${letter}"]`);
                if (bulb) {
                    bulb.classList.add('active');
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => console.log('Click sound failed'));
                    
                    currentMessage += letter;
                    updateMessage();
                    
                    setTimeout(() => bulb.classList.remove('active'), 500);
                }
            }, index * 400);
        });
    });
});


// Send message button
document.querySelector('.send-btn').addEventListener('click', () => {
    if (currentMessage.length > 0) {
        alert(`Message sent: "${currentMessage}"\n\nYour message has been transmitted through the Christmas lights!`);
        
        // Flash all lights to indicate sending
        document.querySelectorAll('.light-bulb').forEach((bulb, index) => {
            setTimeout(() => {
                bulb.classList.add('active');
                setTimeout(() => bulb.classList.remove('active'), 200);
            }, index * 30);
        });
    } else {
        alert('Please spell a message first by clicking the lights!');
    }
});

// Stranger Things theme music - attempt autoplay
const audio = new Audio('Stranger%20Things.mp3');
audio.loop = true;
audio.volume = 0.4;
audio.autoplay = true;

// Try to play immediately on page load
let audioStarted = false;
audio.play().then(() => {
    audioStarted = true;
    console.log('Audio started automatically');
}).catch(e => {
    console.log('Autoplay blocked, waiting for user interaction');
    // Fallback: play on any user interaction
    document.addEventListener('click', () => {
        if (!audioStarted) {
            audio.play().catch(err => console.log('Audio play failed:', err));
            audioStarted = true;
        }
    }, { once: true });
});

// Add more lights dynamically
function createRandomLights() {
    const container = document.querySelector('.lights-container');
    const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'];
    
    for (let i = 0; i < 15; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.top = Math.random() * 100 + '%';
        light.style.left = Math.random() * 100 + '%';
        light.style.background = colors[Math.floor(Math.random() * colors.length)];
        light.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(light);
    }
}

createRandomLights();

// Redirect to menu page after 10 seconds
setTimeout(() => {
    window.location.href = 'menu.html';
}, 10000);

// Audio toggle functionality
audioToggle.addEventListener('click', () => {
    if (!audioStarted) {
        audio.play().catch(e => console.log('Audio play failed:', e));
        audioStarted = true;
    }
    
    isMuted = !isMuted;
    audio.muted = isMuted;
    audioToggle.textContent = isMuted ? '🔇' : '🔊';
    audioToggle.classList.toggle('muted', isMuted);
});

// Add typing effect to tagline
const tagline = document.querySelector('.tagline');
const text = tagline.textContent;
tagline.textContent = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

setTimeout(typeWriter, 1000);


// Audio toggle functionality
const audioToggle = document.getElementById('audio-toggle');
let isMuted = false;


// Lightning sound effect
const lightningSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
lightningSound.volume = 0.4;

// Play lightning sound synchronized with visual effect
setInterval(() => {
    if (audioStarted && !isMuted) {
        lightningSound.play().catch(e => console.log('Lightning sound failed:', e));
    }
}, 8000);


// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

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

// Cursor trail effect
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 50) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
        lastTrailTime = now;
    }
});


// Eerie growl sound effect (delayed)
const growlSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2467/2467-preview.mp3');
growlSound.volume = 0.4;

// Play growl as demogorgon appears
setTimeout(() => {
    growlSound.play().catch(e => console.log('Growl sound failed:', e));
}, 3000);

// Fade out demogorgon before redirect
setTimeout(() => {
    const demogorgon = document.querySelector('.demogorgon-img');
    if (demogorgon) {
        demogorgon.style.transition = 'opacity 1s ease-out';
        demogorgon.style.opacity = '0';
    }
}, 9000);

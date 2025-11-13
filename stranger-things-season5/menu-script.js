// Stranger Things theme music - attempt autoplay
const menuAudio = new Audio('Stranger%20Things.mp3');
menuAudio.loop = true;
menuAudio.volume = 0.3;
menuAudio.autoplay = true;

// Try to play immediately on page load
let audioStarted = false;
menuAudio.play().then(() => {
    audioStarted = true;
    console.log('Menu audio started automatically');
}).catch(e => {
    console.log('Autoplay blocked, waiting for user interaction');
    // Fallback: play on any user interaction
    document.addEventListener('click', () => {
        if (!audioStarted) {
            menuAudio.play().catch(err => console.log('Menu audio play failed:', err));
            audioStarted = true;
        }
    }, { once: true });
});

// Audio toggle functionality
const audioToggle = document.getElementById('audio-toggle');
let isMuted = false;

audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioStarted) {
        menuAudio.play().catch(e => console.log('Menu audio play failed:', e));
        audioStarted = true;
    }
    
    isMuted = !isMuted;
    menuAudio.muted = isMuted;
    audioToggle.textContent = isMuted ? '🔇' : '🔊';
    audioToggle.classList.toggle('muted', isMuted);
});

// Section click handlers
const sections = document.querySelectorAll('.menu-section');
sections.forEach(section => {
    section.addEventListener('click', () => {
        const link = section.getAttribute('data-link');
        window.location.href = link;
    });
});

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

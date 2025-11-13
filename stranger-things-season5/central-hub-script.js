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
    background: rgba(139, 0, 255, 0.5);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(139, 0, 255, 0.8);
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

// Location data
const locations = {
    'wills-home': {
        name: "Byers House",
        desc: "The twisted reflection of Will's home. Christmas lights flicker with messages from another dimension. The air is thick with spores and decay.",
        url: "wills-home.html"
    },
    'laboratory': {
        name: "Hawkins Laboratory",
        desc: "The dark mirror of the lab where it all began. Security systems still function, but they guard something far more sinister now.",
        url: "laboratory.html"
    },
    'school': {
        name: "Hawkins Middle School",
        desc: "Empty hallways echo with phantom voices. Lockers hang open, frozen in time. The gymnasium floor is covered in creeping vines.",
        url: "menu.html"
    },
    'arcade': {
        name: "Palace Arcade",
        desc: "Game cabinets flicker with corrupted screens. The high score displays show impossible numbers. Something moves in the shadows between machines.",
        url: "menu.html"
    }
};

// Location node interactions
const locationNodes = document.querySelectorAll('.location-node');
const locationInfo = document.getElementById('locationInfo');
const locationName = document.getElementById('locationName');
const locationDesc = document.getElementById('locationDesc');
const visitBtn = document.getElementById('visitBtn');

let selectedLocation = null;

locationNodes.forEach(node => {
    node.addEventListener('click', () => {
        const location = node.dataset.location;
        
        // Remove active class from all nodes
        locationNodes.forEach(n => n.classList.remove('active'));
        
        // Add active class to clicked node
        node.classList.add('active');
        
        // Update location info
        const locData = locations[location];
        locationName.textContent = locData.name;
        locationDesc.textContent = locData.desc;
        visitBtn.style.display = 'block';
        selectedLocation = locData.url;
        
        // Play selection sound
        const selectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        selectSound.volume = 0.15;
        selectSound.play().catch(e => console.log('Sound failed'));
    });
    
    node.addEventListener('mouseenter', () => {
        // Play hover sound
        const hoverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        hoverSound.volume = 0.08;
        hoverSound.play().catch(e => console.log('Hover sound failed'));
    });
});

// Visit button
visitBtn.addEventListener('click', () => {
    if (selectedLocation) {
        window.location.href = selectedLocation;
    }
});

// Animate tendrils on hover
const tendrils = document.querySelectorAll('.tendril');
tendrils.forEach(tendril => {
    setInterval(() => {
        tendril.style.strokeDashoffset = Math.random() * 50;
    }, 2000);
});

// Add floating particles
function createParticles() {
    const container = document.querySelector('.hub-container');
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, transparent, rgba(139, 0, 255, 0.5), transparent);
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

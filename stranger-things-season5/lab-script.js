// Laboratory ambient sound - eerie electronic hum
const labAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
labAudio.loop = true;
labAudio.volume = 0.25;

// Play sound on user interaction
let audioStarted = false;
document.addEventListener('click', () => {
    if (!audioStarted) {
        labAudio.play().catch(e => console.log('Lab audio play failed:', e));
        audioStarted = true;
    }
}, { once: true });

// Audio toggle functionality
const audioToggle = document.getElementById('audio-toggle');
let isMuted = false;

audioToggle.addEventListener('click', () => {
    if (!audioStarted) {
        labAudio.play().catch(e => console.log('Lab audio play failed:', e));
        audioStarted = true;
    }
    
    isMuted = !isMuted;
    labAudio.muted = isMuted;
    audioToggle.textContent = isMuted ? '🔇' : '🔊';
    audioToggle.classList.toggle('muted', isMuted);
});

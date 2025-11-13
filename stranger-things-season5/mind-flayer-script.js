// Audio setup - Upside Down theme
const audio = new Audio('the-upside-down---stranger-things-ost-(short)-made-with-Voicemod.mp3');
audio.loop = true;
audio.volume = 0.25;
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
    background: rgba(255, 0, 0, 0.5);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
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

// Tutorial handling
const tutorialOverlay = document.getElementById('tutorialOverlay');
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');

// Check if user has seen tutorial before
const hasSeenTutorial = localStorage.getItem('mindFlayerTutorialSeen');

if (hasSeenTutorial) {
    tutorialOverlay.classList.add('hidden');
}

startBtn.addEventListener('click', () => {
    tutorialOverlay.classList.add('hidden');
    localStorage.setItem('mindFlayerTutorialSeen', 'true');
});

skipBtn.addEventListener('click', () => {
    tutorialOverlay.classList.add('hidden');
    localStorage.setItem('mindFlayerTutorialSeen', 'true');
});

// Encounter logic
const messageText = document.getElementById('messageText');
const choicesContainer = document.getElementById('choicesContainer');
const meterFill = document.getElementById('meterFill');
const meterPercentage = document.getElementById('meterPercentage');
const backButton = document.getElementById('backButton');

let connectionLevel = 0;
let encounterStage = 0;

const encounterStages = [
    {
        message: "The presence fills your mind. It speaks without words, showing you visions of darkness and power...",
        choices: [
            { text: "Resist the Connection", effect: -10, next: 1 },
            { text: "Try to Communicate", effect: 5, next: 2 },
            { text: "Attempt to Flee", effect: 0, next: 3 }
        ]
    },
    {
        message: "You push back against the mental intrusion. The Mind Flayer's presence intensifies, probing deeper...",
        choices: [
            { text: "Focus on Memories of Friends", effect: -15, next: 4 },
            { text: "Accept Partial Connection", effect: 20, next: 5 },
            { text: "Channel Your Fear as Strength", effect: -5, next: 6 }
        ]
    },
    {
        message: "You reach out mentally. Images flood your consciousness - the Upside Down, the gate, countless worlds consumed...",
        choices: [
            { text: "Ask About Its Purpose", effect: 15, next: 7 },
            { text: "Show It Human Compassion", effect: -20, next: 8 },
            { text: "Demand It Leave Hawkins", effect: 10, next: 9 }
        ]
    },
    {
        message: "You turn to run, but the shadows close in. There is no escape from the Mind Flayer's domain...",
        choices: [
            { text: "Stand Your Ground", effect: -10, next: 1 },
            { text: "Surrender to the Connection", effect: 30, next: 10 },
            { text: "Call Out for Help", effect: -5, next: 11 }
        ]
    },
    {
        message: "Memories of your friends shine like beacons in the darkness. The Mind Flayer recoils from the light of human connection...",
        choices: [
            { text: "Push It Back Completely", effect: -25, next: 12 },
            { text: "Maintain the Barrier", effect: -10, next: 13 }
        ]
    },
    {
        message: "The connection deepens. You feel its hunger, its endless need to consume and grow. It offers you power...",
        choices: [
            { text: "Reject the Offer", effect: -15, next: 14 },
            { text: "Accept the Power", effect: 40, next: 15 }
        ]
    },
    {
        message: "Your fear transforms into determination. The Mind Flayer senses your resolve and pauses...",
        choices: [
            { text: "Demand It Leave", effect: -20, next: 16 },
            { text: "Negotiate a Truce", effect: 5, next: 17 }
        ]
    },
    {
        message: "It shows you its purpose: to spread across dimensions, consuming all life. It believes this is natural, inevitable...",
        choices: [
            { text: "Argue for Free Will", effect: -10, next: 18 },
            { text: "Understand Its Nature", effect: 15, next: 19 }
        ]
    },
    {
        message: "You project feelings of love, friendship, sacrifice. The Mind Flayer is confused - these concepts are alien to it...",
        choices: [
            { text: "Show More Humanity", effect: -25, next: 20 },
            { text: "Exploit Its Confusion", effect: -15, next: 21 }
        ]
    },
    {
        message: "You demand it leave Hawkins. The Mind Flayer's presence grows angry, defensive of its territory...",
        choices: [
            { text: "Threaten to Close the Gate", effect: -20, next: 22 },
            { text: "Offer an Alternative", effect: 10, next: 23 }
        ]
    },
    {
        message: "You stop resisting. The Mind Flayer's consciousness floods into yours. You are becoming one with the shadow...",
        choices: [
            { text: "This is the end", effect: 100, next: 24 }
        ]
    },
    {
        message: "Your voice echoes in the void. Somewhere, someone might hear you. But here, you are alone with the shadow...",
        choices: [
            { text: "Keep Fighting", effect: -15, next: 25 },
            { text: "Accept Your Fate", effect: 25, next: 24 }
        ]
    }
];

function updateMeter() {
    connectionLevel = Math.max(0, Math.min(100, connectionLevel));
    meterFill.style.width = connectionLevel + '%';
    meterPercentage.textContent = Math.round(connectionLevel) + '%';
    
    // Change color based on danger level
    if (connectionLevel >= 75) {
        meterPercentage.style.color = '#ff0000';
        meterPercentage.style.animation = 'danger-pulse 0.5s ease-in-out infinite';
    } else if (connectionLevel <= 25) {
        meterPercentage.style.color = '#00ff00';
        meterPercentage.style.animation = 'safe-pulse 0.5s ease-in-out infinite';
    } else {
        meterPercentage.style.color = '#ffaa00';
        meterPercentage.style.animation = 'none';
    }
    
    if (connectionLevel >= 100) {
        endEncounter('consumed');
    } else if (connectionLevel <= 0) {
        endEncounter('escaped');
    }
}

function showStage(stageIndex) {
    if (stageIndex >= encounterStages.length) {
        // Random continuation
        const randomMessages = [
            "The battle of wills continues. Neither side yields...",
            "The Mind Flayer adapts to your resistance...",
            "You feel your strength waning, but you must persist...",
            "The shadow probes for weaknesses in your mind..."
        ];
        messageText.textContent = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        choicesContainer.innerHTML = '';
        const choices = [
            { text: "Continue Resisting", effect: -10 },
            { text: "Try Different Approach", effect: 5 },
            { text: "Gather Your Strength", effect: -5 }
        ];
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => makeChoice(choice.effect, Math.floor(Math.random() * 12)));
            choicesContainer.appendChild(btn);
        });
        return;
    }
    
    const stage = encounterStages[stageIndex];
    messageText.textContent = stage.message;
    
    choicesContainer.innerHTML = '';
    stage.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', () => makeChoice(choice.effect, choice.next));
        choicesContainer.appendChild(btn);
    });
}

function makeChoice(effect, nextStage) {
    connectionLevel += effect;
    updateMeter();
    
    // Disable all buttons temporarily
    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        if (connectionLevel > 0 && connectionLevel < 100) {
            showStage(nextStage);
        }
    }, 1000);
}

function endEncounter(outcome) {
    choicesContainer.innerHTML = '';
    
    if (outcome === 'consumed') {
        messageText.textContent = "The Mind Flayer's consciousness overwhelms yours. You are lost to the shadow. The darkness is eternal...";
        messageText.style.color = '#ff0000';
        
        setTimeout(() => {
            document.body.style.animation = 'fade-to-black 3s forwards';
            setTimeout(() => {
                window.location.href = 'upside-down.html';
            }, 3000);
        }, 2000);
    } else if (outcome === 'escaped') {
        messageText.textContent = "You break free from the Mind Flayer's grasp! Your will proves stronger than the shadow. You've earned your escape...";
        messageText.style.color = '#00ff00';
        backButton.style.display = 'inline-block';
        backButton.textContent = '✓ Return Victorious';
    }
}

// Add fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-to-black {
        to {
            background: #000;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize encounter
showStage(0);
updateMeter();

// Make Mind Flayer eye follow cursor
const mindFlayer = document.getElementById('mindFlayer');
document.addEventListener('mousemove', (e) => {
    const rect = mindFlayer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const distance = Math.min(10, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 50);
    
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    const eye = mindFlayer.querySelector('.flayer-eye');
    eye.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
});

// Add meter percentage animations
const meterStyle = document.createElement('style');
meterStyle.textContent = `
    @keyframes danger-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
    @keyframes safe-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
`;
document.head.appendChild(meterStyle);

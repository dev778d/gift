// Canvas setup for particle effects
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class for floating hearts and shapes
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 20 + 10;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.symbols = ['💕', '💖', '💗', '💓', '💝', '✨', '⭐', '💫'];
        this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
    
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Animation loop for particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Button interaction logic
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const successMessage = document.getElementById('successMessage');
const buttonsContainer = document.querySelector('.buttons-container');

let noBtnClickCount = 0;
const noTexts = [
    'No 😢',
    'Are you sure? 🥺',
    'Really? 💔',
    'Think again! 😭',
    'Please? 🙏',
    'Last chance! 😿',
    "Don't break my heart! 💔"
];

// Yes button click handler
yesBtn.addEventListener('click', () => {
    successMessage.classList.add('show');
    
    // Create celebration particles
    createCelebrationEffect();
    
    // Play success sound (if you add audio)
    // const audio = new Audio('success.mp3');
    // audio.play();
});

// No button mouse movement handler with smooth evasion
let isEvading = false;

noBtn.addEventListener('mouseenter', (e) => {
    if (isEvading) return;
    isEvading = true;
    
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate available space
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;
    
    // Generate random position away from current position
    const currentX = parseFloat(noBtn.style.left) || 0;
    const currentY = parseFloat(noBtn.style.top) || 0;
    
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    
    // Ensure significant movement for smooth visual effect
    while (Math.abs(newX - currentX) < 100 || Math.abs(newY - currentY) < 50) {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
    }
    
    // Ensure button doesn't overlap with Yes button
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const yesBtnX = yesBtnRect.left - containerRect.left;
    const yesBtnY = yesBtnRect.top - containerRect.top;
    
    // If too close to Yes button, move further away
    if (Math.abs(newX - yesBtnX) < 150 && Math.abs(newY - yesBtnY) < 80) {
        newX = newX > yesBtnX ? newX + 100 : newX - 100;
        newY = newY > yesBtnY ? newY + 50 : newY - 50;
    }
    
    // Constrain to container bounds
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    
    // Allow next evasion after animation completes
    setTimeout(() => {
        isEvading = false;
    }, 300);
    
    // Change text occasionally
    noBtnClickCount++;
    if (noBtnClickCount < noTexts.length) {
        noBtn.querySelector('span').textContent = noTexts[noBtnClickCount];
    }
    
    // Shrink button slightly
    noBtn.style.transform = 'scale(0.9)';
    
    // Add shake effect
    noBtn.classList.add('running');
    setTimeout(() => {
        noBtn.classList.remove('running');
    }, 100);
    
    // Make Yes button bigger to encourage clicking it
    yesBtn.style.transform = `scale(${1 + noBtnClickCount * 0.05})`;
});

// Touch support for mobile
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEnterEvent = new MouseEvent('mouseenter', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    noBtn.dispatchEvent(mouseEnterEvent);
});

// Create celebration effect
function createCelebrationEffect() {
    // Add more particles on success
    for (let i = 0; i < 100; i++) {
        const particle = new Particle();
        particle.y = canvas.height / 2 + (Math.random() - 0.5) * 200;
        particle.x = canvas.width / 2 + (Math.random() - 0.5) * 300;
        particle.speedY = Math.random() * 3 + 2;
        particle.speedX = (Math.random() - 0.5) * 4;
        particle.opacity = 1;
        particles.push(particle);
    }
    
    // Remove extra particles after animation
    setTimeout(() => {
        particles.splice(50, particles.length - 50);
    }, 5000);
}

// Initial position for No button
window.addEventListener('load', () => {
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Position No button to the right of Yes button initially
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.position = 'relative';
});

// Easter egg: Make "No" button eventually give up
let hoverCount = 0;
noBtn.addEventListener('mouseenter', () => {
    hoverCount++;
    if (hoverCount > 15) {
        noBtn.style.display = 'none';
        const subtitle = document.querySelector('.subtitle');
        subtitle.textContent = 'Great choice! Now click Yes! 💖';
        subtitle.style.color = '#e91e63';
    }
});

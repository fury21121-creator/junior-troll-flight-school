document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const IMAGE_COUNT = 27; // Troll Face 1.png to Troll Face 27.png
    const PARTICLE_COUNT = 35; // Increased count
    const MIN_DURATION = 15; // Seconds
    const MAX_DURATION = 45; // Seconds
    const MIN_DELAY = 0; // Seconds
    const MAX_DELAY = 20; // Seconds
    const MIN_SIZE = 40; // Pixels
    const MAX_SIZE = 120; // Pixels
    const MIN_OPACITY = 0.2; // Increased from 0.05
    const MAX_OPACITY = 0.5; // Increased from 0.15

    // Create container
    const container = document.createElement('div');
    container.id = 'troll-background-container';
    container.style.position = 'fixed'; // Fixed to viewport
    container.style.inset = '0'; // Top, right, bottom, left = 0
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1'; // Low z-index, but above base
    
    document.body.appendChild(container);

    // Helper: Random Range
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Create Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const img = document.createElement('img');
        
        // Select random image
        const imgNum = randomInt(1, IMAGE_COUNT);
        img.src = `trollface/Troll Face ${imgNum}.png`;
        img.alt = "";
        
        // Base class
        img.className = 'troll-floater';
        
        // Random Properties
        const size = random(MIN_SIZE, MAX_SIZE);
        const left = random(0, 100); // Percentage
        const duration = random(MIN_DURATION, MAX_DURATION);
        const delay = random(MIN_DELAY, MAX_DELAY) - (Math.random() > 0.5 ? 20 : 0); // Negative delay to start mid-animation sometimes
        const opacity = random(MIN_OPACITY, MAX_OPACITY);
        
        // Apply Styles
        img.style.width = `${size}px`;
        img.style.left = `${left}%`;
        img.style.animationDuration = `${duration}s`;
        img.style.animationDelay = `${delay}s`;
        img.style.setProperty('--target-opacity', opacity);
        
        // Random rotation direction (handled in keyframes 0-360, but maybe we want some counter-clockwise?)
        // For now, simple rotation is fine.

        container.appendChild(img);
    }
    
    console.log("Troll background initialized");
});

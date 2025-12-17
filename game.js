document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameButton = document.getElementById('game-button');
    const gameStatus = document.getElementById('game-status');
    const gameDisplay = document.getElementById('game-display');
    const gameCanvasContainer = document.getElementById('game-canvas-container');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // UI Elements
    const balanceDisplay = document.getElementById('balance-display');
    const liveMultiplier = document.getElementById('live-multiplier');
    const gameMessage = document.getElementById('game-message');
    const resultModal = document.getElementById('result-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const playAgainBtn = document.getElementById('play-again-btn');

    console.log("Game JS Loaded v8");

    // Game State
    let balance = 500.00;
    let betAmount = 100.00;
    let isPlaying = false;
    let multiplier = 1.00;
    let animationId = null;
    let startTime = 0;
    let history = []; // Stores {t: timeInSeconds, v: value}
    let flightDuration = 0; // Max time before plane flies away
    let volatility = 0.5; // How jagged the line is
    let restartInterval = null;
    
    // Canvas settings
    let canvasWidth = 0;
    let canvasHeight = 0;
    
    // Load plane image
    const planeImg = new Image();
    planeImg.src = 'aviator.svg'; 
    
    // Initialize UI
    updateBalanceDisplay();
    
    // Resize Handler
    function resizeCanvas() {
        if (!gameCanvasContainer) return;
        canvasWidth = gameCanvasContainer.clientWidth;
        canvasHeight = gameCanvasContainer.clientHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        if (!isPlaying && history.length > 0) drawChart(); 
        else if (!isPlaying) {
             // Idle screen
             ctx.clearRect(0, 0, canvasWidth, canvasHeight);
             ctx.fillStyle = '#eab308';
             ctx.font = '20px Arial';
             ctx.textAlign = 'center';
             ctx.fillText("READY TO FLY", canvasWidth/2, canvasHeight/2);
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Initial resize
    resizeCanvas();
    
    // Event Listeners
    if (gameButton) {
        gameButton.addEventListener('click', () => {
            if (isPlaying) {
                cashOut();
            } else {
                if (balance >= betAmount) {
                    startGame();
                } else {
                    showToast("Insufficient funds! Reload page to reset.");
                }
            }
        });
    }

    // Play Again Listener Removed - Auto Restart Implemented
    /*
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            console.log("Play Again Clicked");
            hideModal();
            resetGame();
        });
    }
    */

    // Removed old delegation and global function to avoid conflicts

    function updateBalanceDisplay() {
        if (balanceDisplay) {
            balanceDisplay.textContent = balance.toFixed(2);
        }
    }

    function showToast(msg) {
        gameStatus.textContent = msg;
        gameStatus.className = "text-red-500 font-bold animate-pulse";
        setTimeout(() => {
            gameStatus.textContent = "Exit too early = Trolled. Exit too late = Rekt.";
            gameStatus.className = "text-jeet-gray text-sm md:text-base";
        }, 3000);
    }

    function showMessage(msg) {
        gameMessage.textContent = msg;
        gameMessage.classList.remove('opacity-0', 'translate-y-4');
    }

    function hideMessage() {
        gameMessage.classList.add('opacity-0', 'translate-y-4');
    }

    function showModal(type, multiplierVal) {
        // Hide the game status message to avoid overlap
        hideMessage();

        // Force flex and remove hidden
        resultModal.classList.remove('hidden', 'pointer-events-none');
        resultModal.classList.add('flex');
        
        // Trigger reflow/delay for opacity transition
        requestAnimationFrame(() => {
            resultModal.classList.remove('opacity-0');
        });
        
        let title, message, icon;
        
        switch(type) {
            case 'paper_hand':
                title = "PAPER HAND";
                message = "You sold before the chart even warmed up. Ngmi behavior.";
                icon = "🧻";
                modalTitle.className = "text-3xl font-black text-gray-400 uppercase tracking-tight";
                break;
            case 'holder':
                title = "HOLDER";
                message = "Respectable exit. You survived to trade another day.";
                icon = "🤝";
                modalTitle.className = "text-3xl font-black text-blue-400 uppercase tracking-tight";
                break;
            case 'diamond_hand':
                title = "DIAMOND HAND";
                message = "Patience rewarded. You stared fear in the face.";
                icon = "💎";
                modalTitle.className = "text-3xl font-black text-yellow-400 uppercase tracking-tight";
                break;
            case 'rekt':
                title = "REKT";
                message = `Crashed at ${multiplierVal}x. Liquidity has left the building.`;
                icon = "💥";
                modalTitle.className = "text-3xl font-black text-red-500 uppercase tracking-tight";
                break;
        }
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalIcon.textContent = icon;

        // Auto Restart Logic
        const countdownEl = document.getElementById('restart-countdown');
        if (countdownEl) {
            let timeLeft = 10;
            countdownEl.textContent = `Restarting in ${timeLeft}s...`;
            
            if (restartInterval) clearInterval(restartInterval);
            
            restartInterval = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = `Restarting in ${timeLeft}s...`;
                
                if (timeLeft <= 0) {
                    clearInterval(restartInterval);
                    hideModal();
                    resetGame();
                }
            }, 1000);
        }
    }

    function hideModal() {
        if (restartInterval) clearInterval(restartInterval);
        resultModal.classList.add('opacity-0', 'pointer-events-none');
        
        // Wait for transition then hide
        setTimeout(() => {
            resultModal.classList.remove('flex');
            resultModal.classList.add('hidden');
        }, 300);
    }

    // Canvas Drawing
    function drawPlane(x, y, angle, scale = 1, text = "") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle); 
        ctx.scale(scale, scale);
        
        if (planeImg.complete && planeImg.naturalWidth !== 0) {
            // Increased size by 2x as requested (126 * 1.4 -> ~176)
            // Original was 126 * 0.7 = ~88. 2x = ~176.
            const width = 126 * 1.4; 
            const ratio = planeImg.naturalHeight / planeImg.naturalWidth;
            const height = width * ratio;
            ctx.drawImage(planeImg, -width/2, -height/2, width, height);
        } else {
            // Fallback
            ctx.fillStyle = '#eab308'; 
            ctx.fillRect(-60, -30, 120, 60);
        }
        
        // Draw Multiplier Text attached to plane
        if (text) {
            // Text settings
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 60px "Courier New", monospace';
            ctx.textAlign = 'right'; // Changed to right alignment
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            // Draw text at negative offset (behind the plane)
            // Plane half-width is approx 88 (176/2). -110 gives some padding.
            ctx.fillText(text, -110, 0);
        }
        
        ctx.restore();
    }

    function drawChart(skipPlane = false) {
        if (history.length === 0) return { currentX: 0, currentY: 0 };

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Grid
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i = 0; i < canvasHeight; i += 40) {
            ctx.moveTo(0, i);
            ctx.lineTo(canvasWidth, i);
        }
        for(let i = 0; i < canvasWidth; i += 40) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvasHeight);
        }
        ctx.stroke();

        // Auto-Scale Logic
        const lastPoint = history[history.length - 1];
        const maxValue = Math.max(...history.map(p => p.v)) * 1.2;
        const minY = 1.0;
        const maxY = Math.max(maxValue, 2.0);

        // Map Logic for Centered Plane (Animated X Position)
        // Animation: Left -> Right -> Middle -> Continue
        const time = lastPoint.t;
        
        let targetPlaneX;
        const middleX = canvasWidth / 2;
        const startX = 30;
        const rightX = canvasWidth - 100;
        
        if (time < 1.0) {
            // Phase 1: Left to Right (0s - 1s)
            // Ease out cubic
            const p = time; 
            targetPlaneX = startX + (rightX - startX) * p;
        } else if (time < 2.5) {
            // Phase 2: Right to Middle (1s - 2.5s)
            // Ease in out
            const p = (time - 1.0) / 1.5;
            targetPlaneX = rightX - (rightX - middleX) * p;
        } else {
            // Phase 3: Stay at Middle (2.5s+)
            targetPlaneX = middleX;
        }
        
        // Calculate Scale Factor to ensure mapX(lastPoint.t) == targetPlaneX
        // mapX(t) = targetPlaneX - (lastPoint.t - t) * scaleFactor
        // At t=0, mapX(0) should ideally be visible or scrolling off
        
        // Let's determine scaleFactor based on keeping a window of time visible
        // When stable at middle:
        // We want (lastPoint.t - t_start) visible on left half?
        // Let's say we show 'effectiveDuration' seconds on the screen width.
        const effectiveDuration = Math.max(time * 1.5, 5.0); // Show more context as time goes
        const scaleFactor = (canvasWidth - 60) / effectiveDuration;
        
        // Now we need to shift the whole graph so that lastPoint.t is at targetPlaneX
        // x = (t - lastPoint.t) * scaleFactor + targetPlaneX
        // check: if t = lastPoint.t -> x = targetPlaneX. Correct.
        
        const mapX = (t) => (t - lastPoint.t) * scaleFactor + targetPlaneX;
        
        const mapY = (v) => canvasHeight - 30 - ((v - minY) / (maxY - minY)) * (canvasHeight - 60);

        // Draw Line
        ctx.strokeStyle = '#22c55e'; // Green line
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(mapX(history[0].t), mapY(history[0].v));
        
        for (let i = 1; i < history.length; i++) {
            ctx.lineTo(mapX(history[i].t), mapY(history[i].v));
        }
        ctx.stroke();
        
        // Gradient fill under curve
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
        ctx.beginPath();
        ctx.moveTo(mapX(history[0].t), mapY(history[0].v));
        for (let i = 1; i < history.length; i++) {
            ctx.lineTo(mapX(history[i].t), mapY(history[i].v));
        }
        ctx.lineTo(mapX(lastPoint.t), canvasHeight);
        ctx.lineTo(mapX(history[0].t), canvasHeight);
        ctx.fill();
        
        // Draw Plane at last point
        const currentX = mapX(lastPoint.t);
        const currentY = mapY(lastPoint.v);
        
        if (!skipPlane) {
             drawPlane(currentX, currentY, 0, 1, lastPoint.v.toFixed(2) + "x");
        }
        
        return { currentX, currentY, mapX, mapY }; // Return coords for animation use
    }

    function gameLoop(timestamp) {
        if (!isPlaying) return;
        
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const dt = 0.016; // Approx 60fps delta
        const timeInSeconds = elapsed / 1000;
        
        // STEADY Animation Logic (Reverted Volatility)
        // Back to smooth exponential growth
        multiplier = 1.00 + (0.08 * timeInSeconds) + (0.04 * Math.pow(timeInSeconds, 2.0));
        
        // Update History
        history.push({t: timeInSeconds, v: multiplier});
        
        // Update UI
        if (liveMultiplier) liveMultiplier.textContent = multiplier.toFixed(2) + "x";
        
        // Update Button with Cash Out Value
        const currentWin = betAmount * multiplier;
        gameButton.textContent = `CASH OUT $${currentWin.toFixed(2)}`;
        
        // Reset color to white/default since volatility is gone
        if (liveMultiplier) liveMultiplier.classList.remove('text-red-500', 'text-green-500');
        
        drawChart();

        // Check End Conditions
        if (multiplier <= 1.00 && timeInSeconds > 0.5) { 
            crash();
        } else if (timeInSeconds >= flightDuration) {
            flyAway();
        } else {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Expose resetGame to global scope for direct HTML access
    // Removed window.restartGame to rely on clean event listener
    /*
    window.restartGame = function() {
        console.log("Global restartGame called");
        hideModal();
        resetGame();
    };
    */

    function resetGame() {
        isPlaying = false;
        multiplier = 1.00;
        startTime = 0;
        history = [];
        if (animationId) cancelAnimationFrame(animationId);
        
        gameButton.textContent = "START GAME";
        gameButton.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white', 'opacity-50', 'cursor-not-allowed');
        gameButton.classList.add('bg-yellow-500', 'hover:bg-yellow-400', 'text-jeet-dark');
        gameButton.disabled = false;
        
        if (liveMultiplier) {
            liveMultiplier.textContent = "1.00x";
            liveMultiplier.style.opacity = '0';
            // Ensure hidden class is preserved or added
            liveMultiplier.className = "hidden text-4xl md:text-5xl font-black text-white drop-shadow-lg transition-all duration-75"; 
        }
        
        hideMessage();
        
        // Reset canvas
        resizeCanvas();
    }

    function startGame() {
        if (balance < betAmount) {
            showToast("Broke? Refresh page.");
            return;
        }

        // Deduct bet
        balance -= betAmount;
        updateBalanceDisplay();

        isPlaying = true;
        multiplier = 1.00;
        history = [{t: 0, v: 1.00}];
        
        // Random Flight Duration (5s to 20s)
        flightDuration = 5 + Math.random() * 15;
        
        // Random Volatility
        volatility = 0.05 + Math.random() * 0.1; // 0.05 to 0.15

        // Instant Rug Chance (5%)
        // If rug, we set duration very short or just crash immediately in loop
        if (Math.random() < 0.05) {
            flightDuration = 0.5; // Will fly away almost instantly
            // Or force crash logic in loop
        }

        gameButton.textContent = "CASH OUT";
        gameButton.classList.remove('bg-yellow-500', 'hover:bg-yellow-400', 'text-jeet-dark');
        gameButton.classList.add('bg-jeet-green', 'hover:bg-jeet-green-bright', 'text-jeet-dark');
        
        showMessage("PUMPING! 🚀");
        
        gameCanvasContainer.classList.remove('hidden');
        gameDisplay.classList.add('hidden'); 
        resizeCanvas();
        
        startTime = 0;
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function flyAway() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        
        if (liveMultiplier) {
            liveMultiplier.textContent = "FLY AWAY";
            liveMultiplier.classList.add('text-yellow-500');
        }
        showMessage("PLANE FLEW AWAY! 👋");
        
        gameButton.textContent = "MISSED IT";
        gameButton.classList.remove('bg-jeet-green', 'hover:bg-jeet-green-bright');
        gameButton.classList.add('bg-gray-500', 'text-white');
        gameButton.disabled = true;

        // Animation
        const startAnimTime = performance.now();
        
        function flyAwayLoop(timestamp) {
            const elapsed = timestamp - startAnimTime;
            const progress = elapsed / 1000; // seconds
            
            // Redraw static chart
            const { currentX, currentY } = drawChart(true); 
            
            let scale = 1;
            let xOff = 0;
            let yOff = 0;
            
            if (progress < 0.2) {
                // Phase 1: Recoil back a bit
                xOff = -30 * (progress / 0.2);
            } else if (progress < 0.5) {
                // Phase 2: Enlarge 5x
                const p = (progress - 0.2) / 0.3;
                xOff = -30;
                scale = 1 + 4 * p; // 1 -> 5
            } else {
                // Phase 3: Fly away
                const p = (progress - 0.5) / 0.5; 
                xOff = -30 + 2000 * p * p; // Accelerate out
                yOff = -500 * p * p;
                scale = 5;
            }
            
            drawPlane(currentX + xOff, currentY + yOff, 0, scale);
            
            if (progress < 1.0) {
                animationId = requestAnimationFrame(flyAwayLoop);
            } else {
                // End animation
                setTimeout(() => {
                    showModal('rekt', multiplier.toFixed(2));
                    if (liveMultiplier) liveMultiplier.classList.remove('text-yellow-500');
                }, 100);
            }
        }
        
        animationId = requestAnimationFrame(flyAwayLoop);
    }

    function cashOut() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        
        // Calculate Winnings
        const winnings = betAmount * multiplier;
        balance += winnings;
        updateBalanceDisplay();
        
        // Determine Category
        let category = 'holder';
        if (multiplier < 1.30) category = 'paper_hand';
        else if (multiplier > 2.20) category = 'diamond_hand';
        
        // Update Button State
        gameButton.textContent = "CASHED OUT";
        gameButton.disabled = true;
        gameButton.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Show Modal
        setTimeout(() => {
            showModal(category, multiplier.toFixed(2));
        }, 500);
    }

    function crash() {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        
        if (liveMultiplier) liveMultiplier.classList.add('text-red-500');
        showMessage("RUGGED! 💥");
        
        // Draw Explosion
        ctx.save();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
        
        gameButton.textContent = "CRASHED";
        gameButton.classList.remove('bg-jeet-green', 'hover:bg-jeet-green-bright');
        gameButton.classList.add('bg-red-500', 'text-white');
        gameButton.disabled = true;
        
        setTimeout(() => {
            showModal('rekt', multiplier.toFixed(2));
            if (liveMultiplier) liveMultiplier.classList.remove('text-red-500');
        }, 1000);
    }
});

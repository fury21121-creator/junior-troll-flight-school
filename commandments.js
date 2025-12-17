const commandments = [
  "Thou shalt not sell the first red candle.",
  "Thou shalt not panic-refresh the chart every 10 seconds.",
  "Thou shalt not call a dip a rug prematurely.",
  "Thou shalt remember: red is temporary, screenshots are forever.",
  "Thou shalt not trust vibes alone (but thou still will).",
  "Thou shalt not sell, then immediately re-buy higher.",
  "Thou shalt not listen to the voice that says “what if it goes lower.”",
  "Thou shalt not call the top after buying it.",
  "Thou shalt not blame the market for emotional decisions.",
  "Thou shalt not say “this time is different” without consequences.",
  "Thou shalt not believe silence always means building.",
  "Thou shalt not believe noise always means strength.",
  "Thou shalt not trade with rent money.",
  "Thou shalt not chase green candles out of boredom.",
  "Thou shalt not fear red candles out of impatience.",
  "Thou shalt not mistake impatience for intelligence.",
  "Thou shalt not sell just to feel relief.",
  "Thou shalt not buy just to feel included.",
  "Thou shalt not refresh Telegram before thinking.",
  "Thou shalt not ignore thy own rules.",
  "Thou shalt not trust every anon with a logo.",
  "Thou shalt not confuse memes with guarantees.",
  "Thou shalt not overtrade out of fear.",
  "Thou shalt not overtrade out of excitement.",
  "Thou shalt not believe every “insider.”",
  "Thou shalt not believe every chart whisper.",
  "Thou shalt not call patience boring.",
  "Thou shalt not sell because others are selling.",
  "Thou shalt not buy because others are buying.",
  "Thou shalt not forget why thou entered.",
  "Thou shalt not revenge-trade losses.",
  "Thou shalt not stare at the chart during dinner.",
  "Thou shalt not check the chart during sleep (yet thou will).",
  "Thou shalt not blame whales for thy emotions.",
  "Thou shalt not blame devs for thy impatience.",
  "Thou shalt not worship green candles.",
  "Thou shalt not fear red ones.",
  "Thou shalt not trade without conviction.",
  "Thou shalt not confuse hope with strategy.",
  "Thou shalt not confuse fear with logic.",
  "Thou shalt not sell the bottom and call it “risk management.”",
  "Thou shalt not buy the top and call it “momentum.”",
  "Thou shalt not believe locked liquidity equals peace.",
  "Thou shalt not believe unlocked liquidity equals doom.",
  "Thou shalt not assume the chart cares about thee.",
  "Thou shalt not ask “why me?”",
  "Thou shalt not expect mercy from the market.",
  "Thou shalt not forget past mistakes.",
  "Thou shalt not repeat them (but thou probably will).",
  "Thou shalt not deny thy inner troll.",
  "Thou shalt not take memes too seriously.",
  "Thou shalt not take trades personally.",
  "Thou shalt not take losses as insults.",
  "Thou shalt not take wins as genius.",
  "Thou shalt not mistake luck for skill.",
  "Thou shalt not mistake skill for immunity.",
  "Thou shalt not sell just to stop feeling anxiety.",
  "Thou shalt not buy just to stop feeling FOMO.",
  "Thou shalt not call regret “learning” without reflection.",
  "Thou shalt not forget this is a game of patience.",
  "Thou shalt not believe every pump is forever.",
  "Thou shalt not believe every dip is death.",
  "Thou shalt not follow noise over conviction.",
  "Thou shalt not silence logic for excitement.",
  "Thou shalt not ignore red flags completely.",
  "Thou shalt not invent red flags out of fear.",
  "Thou shalt not let emotions drive the wheel.",
  "Thou shalt not expect perfect entries.",
  "Thou shalt not expect perfect exits.",
  "Thou shalt accept imperfection.",
  "Thou shalt not mock others without mocking thyself.",
  "Thou shalt not forget: everyone gets trolled eventually.",
  "Thou shalt not think thou art immune.",
  "Thou shalt not deny thy past panic sells.",
  "Thou shalt not pretend patience is easy.",
  "Thou shalt not underestimate boredom.",
  "Thou shalt not overestimate control.",
  "Thou shalt not let a chart define thy worth.",
  "Thou shalt not confuse timing with destiny.",
  "Thou shalt not forget why Junior Troll exists.",
  "Thou shalt not fear being early.",
  "Thou shalt not fear being wrong.",
  "Thou shalt not sell confidence for comfort.",
  "Thou shalt not buy comfort at the top.",
  "Thou shalt not let the market bully thee.",
  "Thou shalt not bully thyself after losses.",
  "Thou shalt not worship charts more than discipline.",
  "Thou shalt not sacrifice patience for peace.",
  "Thou shalt not silence conviction with doubt.",
  "Thou shalt not ignore the troll within.",
  "Thou shalt laugh at losses.",
  "Thou shalt meme thy mistakes.",
  "Thou shalt screenshot regret.",
  "Thou shalt remember memes outlive trades.",
  "Thou shalt not take this too seriously.",
  "Thou shalt not forget this is entertainment.",
  "Thou shalt not blame Junior Troll.",
  "Thou shalt recognize thyself in the face.",
  "Thou shalt learn, laugh, and continue.",
  "Thou shalt never sell the dip… unless thou must — and accept thy fate."
];

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('commandment-text');
    if (!textElement) return;

    let currentIndex = 0;

    // Initial text
    textElement.textContent = commandments[0];
    
    // Add transition class for smooth fading
    textElement.style.transition = 'opacity 0.5s ease-in-out';

    setInterval(() => {
        // Fade out
        textElement.style.opacity = '0';
        
        setTimeout(() => {
            // Update text
            currentIndex = (currentIndex + 1) % commandments.length;
            textElement.textContent = commandments[currentIndex];
            
            // Fade in
            textElement.style.opacity = '1';
        }, 500); // Wait for fade out to complete
    }, 2500); // 2000ms viewing time + 500ms transition
});

// Rotating Subtitle Logic
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.getElementById('subtitle-text');
    if (!subtitle) return;
    
    const texts = [
        "The market trolls. Junior Troll remembers.",
        "The face you make after selling."
    ];
    let idx = 0;
    
    // Initial state
    subtitle.textContent = texts[0];
    
    setInterval(() => {
        subtitle.style.opacity = '0';
        setTimeout(() => {
            idx = (idx + 1) % texts.length;
            subtitle.textContent = texts[idx];
            subtitle.style.opacity = '1';
        }, 500);
    }, 2500); 
});

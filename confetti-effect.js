// Confetti effect for Premium category
(function () {
    // Load confetti library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);

    // Wait a bit for the script to load and for script.js to set up the event listener
    setTimeout(function () {
        // Override the filterByCategory function to add confetti effect
        const originalFilterByCategory = window.filterByCategory;

        window.filterByCategory = function (category) {
            // Call the original function
            if (originalFilterByCategory) {
                originalFilterByCategory(category);
            }

            // If Premium category is selected, trigger confetti
            if (category === 'Premium' && window.confetti) {
                setTimeout(function () {
                    const duration = 3000;
                    const animationEnd = Date.now() + duration;
                    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                    function randomInRange(min, max) {
                        return Math.random() * (max - min) + min;
                    }

                    const interval = setInterval(function () {
                        const timeLeft = animationEnd - Date.now();

                        if (timeLeft <= 0) {
                            return clearInterval(interval);
                        }

                        const particleCount = 50 * (timeLeft / duration);
                        confetti(Object.assign({}, defaults, {
                            particleCount,
                            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                        }));
                        confetti(Object.assign({}, defaults, {
                            particleCount,
                            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                        }));
                    }, 250);
                }, 100);
            }
        };
    }, 1000);
})();

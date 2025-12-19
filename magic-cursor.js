/* Magic Cursor Trail Effect */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'magicCursor';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Create new particles on move
        createParticles(2);
    });

    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: mouse.x,
                y: mouse.y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2 + 1,
                life: 1,
                color: Math.random() > 0.5 ? '160, 100, 255' : '100, 200, 255' // Purple/Blue hues
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Handle particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;     // Fade out speed
            p.size *= 0.95;     // Shrink speed

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
            ctx.fill();

            // Remove dead particles
            if (p.life <= 0 || p.size < 0.2) {
                particles.splice(i, 1);
            }
        }

        // Auto-spawn random sparkles occasionally for ambient magic
        if (Math.random() < 0.05) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: 0,
                vy: -0.5, // Float up
                size: Math.random() * 2,
                life: 0.8,
                color: '255, 255, 255' // White sparkles
            });
        }

        requestAnimationFrame(animate);
    }

    animate();
});

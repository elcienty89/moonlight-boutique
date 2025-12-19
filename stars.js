class StarField {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 50; // Cantidad moderada para no saturar
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1'; // Detrás de todo
        this.canvas.style.pointerEvents = 'none';

        document.body.prepend(this.canvas);

        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.initStars();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initStars() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                opacity: Math.random(),
                speedY: Math.random() * 0.3 + 0.1, // Movimiento vertical lento
                speedX: Math.random() * 0.2 - 0.1  // Leve deriva lateral
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = 'white';

        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Actualizar posición
            star.y -= star.speedY; // Suben suavemente
            star.x += star.speedX;

            // Reiniciar si salen de pantalla
            if (star.y < 0) {
                star.y = this.height;
                star.x = Math.random() * this.width;
            }

            // Titileo suave
            if (Math.random() > 0.95) {
                star.opacity = Math.random();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Iniciar cuando cargue
document.addEventListener('DOMContentLoaded', () => {
    new StarField();
});

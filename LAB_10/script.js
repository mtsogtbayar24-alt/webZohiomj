const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let balloons = [];
let particles = [];
let level = 1;
let timeLeft = 10;
let gameOver = false;
let timer;

const info = document.getElementById("info");
const restartBtn = document.getElementById("restartBtn");
const popSound = document.getElementById("popSound");

class Balloon {
    constructor() {
        this.radius = Math.random() * 20 + 25;
        this.x = Math.random() * (canvas.width - this.radius);
        this.y = Math.random() * (canvas.height - this.radius);

        this.dx = (Math.random() - 0.5) * 3;
        this.dy = (Math.random() - 0.5) * 3;

        this.hue = Math.random() * 360;
        this.popped = false;
    }

    draw() {
        let grad = ctx.createRadialGradient(
            this.x - this.radius/3,
            this.y - this.radius/3,
            this.radius * 0.2,
            this.x,
            this.y,
            this.radius
        );

        grad.addColorStop(0, "white");
        grad.addColorStop(0.3, `hsl(${this.hue}, 80%, 70%)`);
        grad.addColorStop(1, `hsl(${this.hue}, 80%, 40%)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < this.radius || this.x > canvas.width - this.radius) this.dx *= -1;
        if (this.y < this.radius || this.y > canvas.height - this.radius) this.dy *= -1;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 6;
        this.dy = (Math.random() - 0.5) * 6;
        this.life = 30;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life--;
    }
}

function startLevel() {
    balloons = [];
    particles = [];
    timeLeft = 10;
    gameOver = false;

    for (let i = 0; i < 5 + (level - 1) * 2; i++) {
        balloons.push(new Balloon());
    }

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    balloons.forEach((b, i) => {
        const dist = Math.hypot(mx - b.x, my - b.y);

        if (dist < b.radius && !b.popped) {
            b.popped = true;

            for (let i = 0; i < 15; i++) {
                particles.push(new Particle(b.x, b.y, `hsl(${b.hue},80%,60%)`));
            }

            popSound.currentTime = 0;
            popSound.play();
        }
    });
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balloons = balloons.filter(b => !b.popped);
    balloons.forEach(b => {
        b.update();
        b.draw();
    });

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    info.innerText = `Үе: ${level} | Цаг: ${timeLeft} | Үлдсэн бөмбөг: ${balloons.length}`;

    if (balloons.length === 0 && !gameOver) {
        clearInterval(timer);
        level++;
        startLevel();
    }

    if (!gameOver) requestAnimationFrame(animate);
}

function endGame() {
    gameOver = true;
    clearInterval(timer);
    info.innerText = "Цаг дууслаа!";
    restartBtn.style.display = "inline-block";
}

restartBtn.onclick = () => {
    level = 1;
    restartBtn.style.display = "none";
    startLevel();
    animate();
};

startLevel();
animate();
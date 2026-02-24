document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("smokeCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /* ================= SMOKE ================= */

  const smokeParticles = [];

  class Smoke {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 140 + 90;
      this.speedY = Math.random() * 0.25 + 0.1;
      this.speedX = Math.random() * 0.15 - 0.075;
      this.opacity = Math.random() * 0.04 + 0.015;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.angle) * 0.25 + this.speedX;
      this.angle += 0.002;

      if (this.y < -this.size) {
        this.reset();
      }
    }

    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, this.size * 0.2,
        this.x, this.y, this.size
      );

      gradient.addColorStop(0, `rgba(160,160,160,${this.opacity})`);
      gradient.addColorStop(1, `rgba(160,160,160,0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 18; i++) {
    smokeParticles.push(new Smoke());
  }

  /* ================= PREMIUM SPARKS ================= */

  const sparks = [];

  class Spark {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * (canvas.height * 0.25);
      this.size = Math.random() * 2 + 1;
      this.speedY = Math.random() * 0.25 + 0.05;
      this.speedX = Math.random() * 0.1 - 0.05;

      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.6 + 0.3;

      this.fadeIn = true;
      this.fadeSpeed = Math.random() * 0.01 + 0.004;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Плавное появление
      if (this.fadeIn) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= this.maxOpacity) {
          this.fadeIn = false;
        }
      } else {
        this.opacity -= this.fadeSpeed * 0.5;
      }

      if (this.opacity <= 0 || this.y > canvas.height * 0.35) {
        this.reset();
      }
    }

    draw() {
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 5
      );

      gradient.addColorStop(0, `rgba(255,170,60,${this.opacity})`);
      gradient.addColorStop(0.4, `rgba(255,60,0,${this.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(255,0,0,0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // МЕНЬШЕ = ДОРОЖЕ
  for (let i = 0; i < 18; i++) {
    sparks.push(new Spark());
  }

  /* ================= LOOP ================= */

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    smokeParticles.forEach(p => {
      p.update();
      p.draw();
    });

    sparks.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
});
/* ================= SCROLL REVEAL ================= */

/* ================= ADVANCED SCROLL REVEAL ================= */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {

      // Если это контейнер карточек
      if (entry.target.classList.contains("cards")) {

        const cards = entry.target.querySelectorAll(".card");

        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, index * 150); // задержка между карточками
        });

      } else {
        entry.target.classList.add("visible");
      }

    }

  });
}, { threshold: 0.15 });

document.querySelectorAll(".section, .rule-box")
  .forEach(el => observer.observe(el));

document.querySelectorAll(".cards")
  .forEach(el => observer.observe(el));
  /* ================= PARALLAX ================= */

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const hero = document.querySelector(".hero");

  if (hero) {
    hero.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
});
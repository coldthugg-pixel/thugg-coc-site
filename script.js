document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("smokeCanvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  /* ================= SMOKE ================= */

  const smokes = [];
  const sparks = [];

  class Smoke {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random()*canvas.width;
      this.y = canvas.height + Math.random()*100;
      this.size = Math.random()*120+80;
      this.speed = Math.random()*0.3+0.1;
      this.opacity = Math.random()*0.05+0.02;
    }

    update() {
      this.y -= this.speed;
      if(this.y < -this.size) this.reset();
    }

    draw() {
      const g = ctx.createRadialGradient(
        this.x,this.y,this.size*0.2,
        this.x,this.y,this.size
      );
      g.addColorStop(0,`rgba(180,180,180,${this.opacity})`);
      g.addColorStop(1,"rgba(180,180,180,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }
  }

  class Spark {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random()*canvas.width;
      this.y = Math.random()*(canvas.height*0.3);
      this.size = Math.random()*2+1;
      this.speedY = Math.random()*0.4+0.1;
      this.opacity = Math.random()*0.8+0.2;
    }

    update() {
      this.y += this.speedY;
      this.opacity -= 0.01;
      if(this.opacity<=0) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,100,0,${this.opacity})`;
      ctx.fill();
    }
  }

  for(let i=0;i<15;i++) smokes.push(new Smoke());
  for(let i=0;i<25;i++) sparks.push(new Spark());

  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    smokes.forEach(s=>{s.update();s.draw();});
    sparks.forEach(s=>{s.update();s.draw();});
    requestAnimationFrame(animate);
  }

  animate();

  /* ================= APPLE STYLE CROSSFADE FIX ================= */

  const sections = document.querySelectorAll(".section");

  // 💥 ВАЖНО: делаем первую секцию активной
  if (sections.length > 0) {
    sections[0].classList.add("active");
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        sections.forEach(sec => sec.classList.remove("active"));
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.6
  });

  sections.forEach(section => observer.observe(section));

});
document.addEventListener("DOMContentLoaded", () => {

  const themeBtn = document.getElementById("themeToggle");

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("blue-theme");
  });

});
document.addEventListener("DOMContentLoaded", () => {

  /* ===== TELEGRAM CONFIG ===== */

  const BOT_TOKEN = "8273970021:AAFV2Dz6xMCMcLDTb5m-ryjChhhY6qdoSsc";
  const CHAT_ID = "5607820177";

  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Ваш ник"]').value;
    const tag = form.querySelector('input[placeholder="Тег игрока"]').value;
    const level = form.querySelector("select").value;
    const about = form.querySelector("textarea").value;

    const message = `
🦅 Новая заявка в ЯСТРЕБЫ CLASH

👤 Ник: ${name}
🏷 Тег: ${tag}
🏰 Ратуша: ${level}
📄 О себе: ${about}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot8273970021:AAFV2Dz6xMCMcLDTb5m-ryjChhhY6qdoSsc/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
          })
        }
      );

      const data = await response.json();

      if (data.ok) {
        alert("✅ Заявка успешно отправлена!");
        form.reset();
      } else {
        alert("❌ Ошибка Telegram API");
      }

    } catch (error) {
      alert("❌ Ошибка отправки");
    }

  });

});
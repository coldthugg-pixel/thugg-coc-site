document.addEventListener("DOMContentLoaded", () => {

  /* ================= SECTIONS ================= */

  const sections = document.querySelectorAll(".section");

  if (sections.length > 0) {
    sections[0].classList.add("active");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sections.forEach(s => s.classList.remove("active"));
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));
  }

  /* ================= CANVAS ================= */

  const canvas = document.getElementById("smokeCanvas");

  if (canvas) {

    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const smokes = [];
    const sparks = [];

    class Smoke {
      constructor(){ this.reset(); }
      reset(){
        this.x=Math.random()*canvas.width;
        this.y=canvas.height+Math.random()*100;
        this.size=Math.random()*120+80;
        this.speed=Math.random()*0.3+0.1;
        this.opacity=Math.random()*0.05+0.02;
      }
      update(){ this.y-=this.speed; if(this.y<-this.size)this.reset(); }
      draw(){
        const g=ctx.createRadialGradient(this.x,this.y,this.size*.2,this.x,this.y,this.size);
        g.addColorStop(0,`rgba(180,180,180,${this.opacity})`);
        g.addColorStop(1,"rgba(180,180,180,0)");
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
      }
    }

    class Spark {
      constructor(){ this.reset(); }
      reset(){
        this.x=Math.random()*canvas.width;
        this.y=Math.random()*(canvas.height*.3);
        this.size=Math.random()*2+1;
        this.speedY=Math.random()*0.4+0.1;
        this.opacity=Math.random()*0.8+0.2;
      }
      update(){
        this.y+=this.speedY;
        this.opacity-=0.01;
        if(this.opacity<=0)this.reset();
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,100,0,${this.opacity})`;
        ctx.fill();
      }
    }

    for(let i=0;i<15;i++) smokes.push(new Smoke());
    for(let i=0;i<25;i++) sparks.push(new Spark());

    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      smokes.forEach(s=>{s.update();s.draw();});
      sparks.forEach(s=>{s.update();s.draw();});
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ================= TELEGRAM FORM ================= */

  const form = document.querySelector("form");

  if (!form) return; // 💥 теперь ошибок не будет

  const BOT_TOKEN = "8273970021:AAFV2Dz6xMCMcLDTb5m-ryjChhhY6qdoSsc";
 const ADMIN_IDS = [
  "5607820177",
  "1069247330",
  "111222333",
  "444555666"
];

  let applicationCount = parseInt(localStorage.getItem("applicationCount") || "0");

  function getNextNumber() {
    applicationCount++;
    localStorage.setItem("applicationCount", applicationCount);
    return "#" + applicationCount.toString().padStart(3, "0");
  }

  const COOLDOWN_TIME = 30000;

  function canSubmit() {
    const last = localStorage.getItem("lastSubmitTime");
    if (!last) return true;
    return Date.now() - parseInt(last) > COOLDOWN_TIME;
  }

  function setSubmitTime() {
    localStorage.setItem("lastSubmitTime", Date.now());
  }

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!canSubmit()) {
      alert("Можно отправлять заявку раз в 30 секунд");
      return;
    }

    const inputs = form.querySelectorAll("input");
    const selects = form.querySelectorAll("select");
    const textarea = form.querySelector("textarea");

    const telegram = inputs[0].value.trim();
    const tag = inputs[1].value.trim();
    const level = selects[0].value;
    const clan = selects[1].value;
    const about = textarea.value.trim();

    // ===== ВАЛИДАЦИЯ =====

    if (!telegram.startsWith("@")) {
      alert("Telegram должен начинаться с @");
      return;
    }

    if (!tag.startsWith("#")) {
      alert("Тег игрока должен начинаться с #");
      return;
    }

    if (about.length < 10) {
      alert("Минимум 10 символов в разделе 'О себе'");
      return;
    }

    const number = getNextNumber();

    const message = `
🦅 Новая заявка ${number}

📱 Telegram: ${telegram}
🏷 Тег: ${tag}
🏰 Ратуша: ${level}
🛡 Клан: ${clan}
📄 О себе: ${about}
`;

    try {

      for (let chatId of ADMIN_IDS) {
        await fetch(`https://api.telegram.org/bot8273970021:AAFV2Dz6xMCMcLDTb5m-ryjChhhY6qdoSsc/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        });
      }

      setSubmitTime();
      alert(`Заявка ${number} отправлена`);
      form.reset();

    } catch (err) {
      alert("Ошибка отправки");
    }

  });
/* ===== АВТОВСТАВКА @ и # ===== */

const inputs = form.querySelectorAll("input");

const telegramInput = inputs[0];
const tagInput = inputs[1];

// Telegram — авто @
telegramInput.addEventListener("focus", () => {
  if (telegramInput.value === "") {
    telegramInput.value = "@";
  }
});

// Если удалили всё — возвращаем @
telegramInput.addEventListener("blur", () => {
  if (telegramInput.value === "@") {
    telegramInput.value = "";
  }
});

// Тег — авто #
tagInput.addEventListener("focus", () => {
  if (tagInput.value === "") {
    tagInput.value = "#";
  }
});

tagInput.addEventListener("blur", () => {
  if (tagInput.value === "#") {
    tagInput.value = "";
  }
});
/* ================= INFINITE HALL FIX ================= */

document.querySelectorAll(".hall-track").forEach(track => {
  const cards = Array.from(track.children);

  // клонируем 4 раза для настоящей бесконечности
  for (let i = 0; i < 4; i++) {
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }

/* ================= CLEAN AUTO CENTER ================= */

document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll(".section");
  let isSnapping = false;
  let scrollTimeout;

  window.addEventListener("scroll", () => {

    if (isSnapping) return;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {

      let closest = null;
      let closestDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = section;
        }
      });

      if (closest) {
        isSnapping = true;

        closest.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        sections.forEach(s => s.classList.remove("section-active"));
        closest.classList.add("section-active");

        setTimeout(() => {
          isSnapping = false;
        }, 700);
      }

    }, 160);

  });

});
});
});
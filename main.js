/* ==========================================
   NEURAL NETWORK CANVAS
   ========================================== */
(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], animId;

  const NODE_COUNT = 70;
  const CONNECT_DIST = 160;
  const NODE_SPEED = 0.28;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: Math.random() * 2 + 1,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, makeNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.45;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,179,237,0.7)';
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  init();
  loop();
})();


/* ==========================================
   TYPED TEXT HERO
   ========================================== */
(function () {
  const phrases = [
    'AI Engineer',
    'LLM Integration Engineer',
    'Full Stack AI Developer',
    'Generative AI Builder',
    'Prompt Engineering Specialist',
  ];

  const el = document.getElementById('typed-text');
  let pi = 0, ci = 0, deleting = false, wait = 0;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        wait = 60;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      if (wait > 0) { wait--; }
      else {
        el.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }

  tick();
})();


/* ==========================================
   ORBIT ICONS — JS positioned so they're
   evenly spread around each ring
   ========================================== */
(function () {
  const icons = [
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React', ring: 'outer', offset: 0 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', alt: 'Python', ring: 'outer', offset: 120 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker', ring: 'outer', offset: 240 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', alt: 'Node', ring: 'mid', offset: 60 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TypeScript', ring: 'mid', offset: 240 },
  ];

  const ringMeta = {
    outer: { el: document.getElementById('ring-outer'), dur: 28, dir: 1 },
    mid:   { el: document.getElementById('ring-mid'),   dur: 20, dir: -1 },
    inner: { el: document.getElementById('ring-inner'), dur: 14, dir: 1 },
  };

  icons.forEach(({ src, alt, ring, offset }) => {
    const meta = ringMeta[ring];
    if (!meta || !meta.el) return;

    const rect = meta.el; // will use getBoundingClientRect after paint
    const icon = document.createElement('div');
    icon.className = 'orbit-icon';
    icon.setAttribute('data-ring', ring);
    icon.setAttribute('data-offset', offset);

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    icon.appendChild(img);

    // counter-spin animation inline
    const counterDir = meta.dir > 0 ? 'reverse' : 'normal';
    icon.style.animation = `counter-spin ${meta.dur}s linear infinite ${counterDir}`;

    meta.el.appendChild(icon);
  });

  // Position icons using ring radius after layout
  function positionIcons() {
    Object.values(ringMeta).forEach(({ el, dur, dir }) => {
      if (!el) return;
      const r = el.offsetWidth / 2;
      const icons = el.querySelectorAll('.orbit-icon');
      icons.forEach(icon => {
        const angleDeg = parseFloat(icon.getAttribute('data-offset')) || 0;
        const rad = (angleDeg - 90) * Math.PI / 180;
        const x = r + r * Math.cos(rad) - 21; // 21 = half icon size
        const y = r + r * Math.sin(rad) - 21;
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
        icon.style.position = 'absolute';
      });
    });
  }

  // Run after fonts/layout settle
  requestAnimationFrame(() => requestAnimationFrame(positionIcons));
})();


/* ==========================================
   SCROLL REVEAL
   ========================================== */
(function () {
  const targets = document.querySelectorAll(
    '.tl-card, .skill-group, .project-card, .edu-card, .cert-item, .about-text, .about-card'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => io.observe(el));
})();


/* ==========================================
   SIDEBAR ACTIVE LINK HIGHLIGHT
   ========================================== */
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();


/* ==========================================
   STAGGER REVEAL FOR SKILL GROUPS
   ========================================== */
(function () {
  const groups = document.querySelectorAll('.skill-group');
  groups.forEach((g, i) => {
    g.style.transitionDelay = `${i * 0.06}s`;
  });
})();

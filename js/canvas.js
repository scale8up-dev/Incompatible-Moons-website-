/**
 * Incompatible Moons — Ambient Cosmic Canvas
 * Renders an interactive starfield and dual orbiting celestial bodies.
 */

(function () {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Starfield setup
  const STAR_COUNT = Math.min(120, Math.floor((width * height) / 10000));
  const stars = [];

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.6 ? '#c084fc' : (Math.random() > 0.4 ? '#38bdf8' : '#ffffff')
    });
  }

  // Interactive mouse influence
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  // Orbital Moons Simulation
  // Dual moons in eccentric, intersecting orbits
  let time = 0;
  const ripples = [];

  window.addEventListener('click', (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 100,
      alpha: 0.8,
      color: ripples.length % 2 === 0 ? 'rgba(168, 85, 247,' : 'rgba(6, 182, 212,'
    });
  });

  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
  });

  function draw() {
    if (!isRunning) {
      requestAnimationFrame(draw);
      return;
    }

    // Smooth mouse lerping
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars
    for (let s of stars) {
      s.alpha += s.twinkleSpeed * s.direction;
      if (s.alpha >= 0.95) {
        s.alpha = 0.95;
        s.direction = -1;
      } else if (s.alpha <= 0.15) {
        s.alpha = 0.15;
        s.direction = 1;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Gravitational Core & Orbits Center
    // Center point shifts subtly towards mouse
    const centerX = width * 0.5 + (mouse.x - width * 0.5) * 0.08;
    const centerY = height * 0.42 + (mouse.y - height * 0.42) * 0.08;

    time += 0.008;

    // Moon 1: Amethyst Moon (Eccentric Ellipse 1)
    const orbit1RadiusX = Math.min(width * 0.38, 380);
    const orbit1RadiusY = Math.min(height * 0.22, 190);
    const tilt1 = -0.35; // orbit tilt in radians
    const angle1 = time * 0.8;

    const rawX1 = Math.cos(angle1) * orbit1RadiusX;
    const rawY1 = Math.sin(angle1) * orbit1RadiusY;
    const moon1X = centerX + (rawX1 * Math.cos(tilt1) - rawY1 * Math.sin(tilt1));
    const moon1Y = centerY + (rawX1 * Math.sin(tilt1) + rawY1 * Math.cos(tilt1));

    // Moon 2: Cyan Moon (Eccentric Ellipse 2 with conflicting tilt)
    const orbit2RadiusX = Math.min(width * 0.34, 340);
    const orbit2RadiusY = Math.min(height * 0.24, 210);
    const tilt2 = 0.52; // opposite tilt angle!
    const angle2 = -time * 0.65 + Math.PI;

    const rawX2 = Math.cos(angle2) * orbit2RadiusX;
    const rawY2 = Math.sin(angle2) * orbit2RadiusY;
    const moon2X = centerX + (rawX2 * Math.cos(tilt2) - rawY2 * Math.sin(tilt2));
    const moon2Y = centerY + (rawX2 * Math.sin(tilt2) + rawY2 * Math.cos(tilt2));

    // Draw faint orbit tracks
    drawOrbitEllipse(centerX, centerY, orbit1RadiusX, orbit1RadiusY, tilt1, 'rgba(168, 85, 247, 0.09)');
    drawOrbitEllipse(centerX, centerY, orbit2RadiusX, orbit2RadiusY, tilt2, 'rgba(6, 182, 212, 0.09)');

    // Gravitational wave connection line when moons are in proximity
    const distBetween = Math.hypot(moon1X - moon2X, moon1Y - moon2Y);
    if (distBetween < 300) {
      const lineAlpha = (1 - distBetween / 300) * 0.35;
      ctx.beginPath();
      ctx.moveTo(moon1X, moon1Y);
      ctx.lineTo(moon2X, moon2Y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Render Moon 1 (Amethyst)
    drawMoon(moon1X, moon1Y, 18, '#a855f7', 'rgba(168, 85, 247, 0.3)', 'rgba(192, 132, 252, 0.9)');

    // Render Moon 2 (Cyan)
    drawMoon(moon2X, moon2Y, 14, '#06b6d4', 'rgba(6, 182, 212, 0.3)', 'rgba(56, 189, 248, 0.9)');

    // Draw Click Gravitational Ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += 2.2;
      rip.alpha -= 0.02;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = rip.color + `${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  function drawOrbitEllipse(cx, cy, rx, ry, rotation, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawMoon(x, y, radius, baseColor, glowColor, highlightColor) {
    ctx.save();
    // Outer atmospheric glow
    const gradGlow = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius * 3.5);
    gradGlow.addColorStop(0, glowColor);
    gradGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradGlow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Body gradient
    const gradBody = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.1, x, y, radius);
    gradBody.addColorStop(0, highlightColor);
    gradBody.addColorStop(0.7, baseColor);
    gradBody.addColorStop(1, '#05070f');

    ctx.fillStyle = gradBody;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle rim highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  requestAnimationFrame(draw);
})();

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  radius: number;
  trail: { x: number; y: number }[];
  hue: number;
  life: number;
  maxLife: number;
  size: number;
  orbitX: number;
  orbitY: number;
  orbitRadius: number;
  orbitSpeed: number;
  type: "orbit" | "drift" | "burst";
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const spawnParticle = useCallback((w: number, h: number, type?: Particle["type"]): Particle => {
    const t = type ?? (Math.random() < 0.5 ? "orbit" : Math.random() < 0.5 ? "drift" : "burst");
    const cx = w / 2;
    const cy = h / 2;

    if (t === "orbit") {
      const orbitRadius = 60 + Math.random() * Math.min(w, h) * 0.32;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: cx + Math.cos(angle) * orbitRadius,
        y: cy + Math.sin(angle) * orbitRadius,
        angle,
        speed: 0,
        radius: 0,
        trail: [],
        hue: 260 + Math.random() * 80,
        life: 0,
        maxLife: 9999,
        size: Math.random() * 2 + 0.8,
        orbitX: cx,
        orbitY: cy,
        orbitRadius,
        orbitSpeed: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        type: "orbit",
      };
    }

    if (t === "drift") {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.1,
        radius: 0,
        trail: [],
        hue: 280 + Math.random() * 60,
        life: 0,
        maxLife: 400 + Math.random() * 400,
        size: Math.random() * 1.5 + 0.5,
        orbitX: 0, orbitY: 0, orbitRadius: 0, orbitSpeed: 0,
        type: "drift",
      };
    }

    // burst — spawns from center or mouse
    const src = mouseRef.current.active
      ? { x: mouseRef.current.x, y: mouseRef.current.y }
      : { x: cx, y: cy };
    const a = Math.random() * Math.PI * 2;
    const spd = Math.random() * 2.5 + 0.8;
    return {
      x: src.x,
      y: src.y,
      angle: a,
      speed: spd,
      radius: 0,
      trail: [],
      hue: 290 + Math.random() * 50,
      life: 0,
      maxLife: 80 + Math.random() * 80,
      size: Math.random() * 2.2 + 0.6,
      orbitX: 0, orbitY: 0, orbitRadius: 0, orbitSpeed: 0,
      type: "burst",
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = [
        ...Array.from({ length: 40 }, () => spawnParticle(canvas.width, canvas.height, "orbit")),
        ...Array.from({ length: 30 }, () => spawnParticle(canvas.width, canvas.height, "drift")),
      ];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const TRAIL_LEN = 18;

    const draw = () => {
      frameRef.current++;
      const w = canvas.width;
      const h = canvas.height;

      // Fade trail — semi-transparent fill instead of clearRect
      ctx.fillStyle = "rgba(10, 3, 22, 0.18)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;

      // Spawn burst particles from mouse every few frames
      if (mouseRef.current.active && frameRef.current % 3 === 0) {
        particles.push(spawnParticle(w, h, "burst"));
      }

      // Draw + update
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === "orbit") {
          p.angle += p.orbitSpeed;
          // Slowly drift orbit center toward canvas center
          p.orbitX += (w / 2 - p.orbitX) * 0.0005;
          p.orbitY += (h / 2 - p.orbitY) * 0.0005;
          p.x = p.orbitX + Math.cos(p.angle) * p.orbitRadius;
          p.y = p.orbitY + Math.sin(p.angle) * p.orbitRadius;
        } else if (p.type === "drift") {
          // Gentle Perlin-like curve using sine
          p.angle += 0.008 * Math.sin(p.life * 0.02);
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          // Wrap
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        } else {
          // burst — decelerate
          p.speed *= 0.93;
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }
        }

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        // Compute global alpha
        let alpha = 1;
        if (p.type === "burst") {
          alpha = 1 - p.life / p.maxLife;
        } else if (p.type === "drift") {
          const half = p.maxLife / 2;
          alpha = p.life < half ? p.life / half : 1 - (p.life - half) / half;
          alpha = Math.max(0, Math.min(1, alpha));
        }

        // Draw trail as a tapering path
        if (p.trail.length > 2) {
          for (let t = 1; t < p.trail.length; t++) {
            const ta = (t / p.trail.length) * alpha;
            ctx.beginPath();
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.strokeStyle = `hsla(${p.hue}, 90%, 72%, ${ta * 0.55})`;
            ctx.lineWidth = (t / p.trail.length) * p.size * 1.6;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        // Glow core
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 7);
        grd.addColorStop(0, `hsla(${p.hue}, 95%, 88%, ${alpha * 0.9})`);
        grd.addColorStop(0.3, `hsla(${p.hue}, 85%, 70%, ${alpha * 0.35})`);
        grd.addColorStop(1, `hsla(${p.hue}, 75%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 7, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Hard dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${alpha})`;
        ctx.fill();
      }

      // Refill drift particles as they expire
      const driftCount = particles.filter(p => p.type === "drift").length;
      if (driftCount < 30) {
        particles.push(spawnParticle(w, h, "drift"));
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ display: "block", zIndex: 0 }}
    />
  );
}


"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number; // 0.2 (distant) to 1.0 (foreground)
  color: string;
};

type ShootingStar = {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
};

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with interpolation (lerp)
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      isActive: false,
    };

    // Nebula cloud focal anchors
    const nebulae = [
      { xRatio: 0.18, yRatio: 0.22, color: "rgba(56, 110, 240, 0.08)", radius: 460 },
      { xRatio: 0.82, yRatio: 0.38, color: "rgba(139, 92, 246, 0.09)", radius: 520 },
      { xRatio: 0.45, yRatio: 0.72, color: "rgba(14, 165, 233, 0.07)", radius: 480 },
      { xRatio: 0.75, yRatio: 0.85, color: "rgba(168, 85, 247, 0.08)", radius: 440 },
    ];

    // Star collection
    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    const ripples: Ripple[] = [];
    const dustParticles: DustParticle[] = [];

    // Scale star count by screen area (rich on desktop, battery-friendly on mobile)
    const isMobile = width < 768;
    const starCount = isMobile ? 350 : 850;

    const starPalettes = [
      "rgba(255, 255, 255,",
      "rgba(224, 231, 255,", // pale indigo
      "rgba(186, 230, 253,", // pale cyan
      "rgba(238, 242, 255,", // soft white
      "rgba(216, 180, 254,", // pale violet
    ];

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.2 + Math.random() * 0.8;
        const baseAlpha = 0.2 + depth * 0.6;
        const colorPrefix = starPalettes[Math.floor(Math.random() * starPalettes.length)];

        stars.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: Math.max(0.6, depth * 1.8),
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth,
          color: colorPrefix,
        });
      }
    }

    initStars();

    // Resize handler
    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    }

    window.addEventListener("resize", handleResize, { passive: true });

    // Pointer move listener
    function handlePointerMove(e: MouseEvent | TouchEvent) {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? -1000 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? -1000 : e.clientY;

      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.isActive = true;

      // Spawn subtle dust particles if mouse is moving with velocity
      if (mouse.prevX > 0 && !prefersReducedMotion) {
        const dx = clientX - mouse.prevX;
        const dy = clientY - mouse.prevY;
        const dist = Math.hypot(dx, dy);
        mouse.speed = dist;

        if (dist > 12 && dustParticles.length < 40) {
          dustParticles.push({
            x: clientX + (Math.random() - 0.5) * 10,
            y: clientY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.8 - dx * 0.03,
            vy: (Math.random() - 0.5) * 0.8 - dy * 0.03,
            size: 0.8 + Math.random() * 1.5,
            alpha: 0.7,
            color: Math.random() > 0.5 ? "rgba(165, 180, 252," : "rgba(125, 211, 252,",
          });
        }
      }

      mouse.prevX = clientX;
      mouse.prevY = clientY;
    }

    function handlePointerLeave() {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    }

    // Click handler for cosmic ripple
    function handleClick(e: MouseEvent) {
      if (prefersReducedMotion) return;
      // Do not trigger ripple if clicking an interactive control
      const target = e.target as HTMLElement | null;
      if (target && (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("textarea"))) {
        return;
      }
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.35,
        alpha: 0.45,
      });
    }

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    // Shooting star spawner
    let lastShootingStarTime = Date.now();
    function maybeSpawnShootingStar(now: number) {
      if (prefersReducedMotion) return;
      if (now - lastShootingStarTime > 4000 && shootingStars.length < 2) {
        if (Math.random() < 0.015) {
          lastShootingStarTime = now;
          const startX = Math.random() * width * 0.8;
          const startY = Math.random() * (height * 0.4);
          const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 degrees downward
          shootingStars.push({
            x: startX,
            y: startY,
            length: 80 + Math.random() * 80,
            speed: 6 + Math.random() * 4,
            angle,
            alpha: 1,
            life: 0,
            maxLife: 50 + Math.random() * 30,
          });
        }
      }
    }

    // Animation frame loop
    let tick = 0;
    function render() {
      if (!ctx) return;
      animId = requestAnimationFrame(render);
      tick++;

      // Smooth cursor lerp
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw volumetric breathing nebulae
      const breath = Math.sin(tick * 0.008) * 0.02;
      nebulae.forEach((nebula) => {
        const cx = nebula.xRatio * width;
        const cy = nebula.yRatio * height;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nebula.radius);
        grad.addColorStop(0, nebula.color);
        grad.addColorStop(0.5, nebula.color.replace(/[\d.]+\)$/, `${0.03 + breath})`));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Interactive cursor ambient glow
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        const glowRadius = isMobile ? 180 : 260;
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        cursorGlow.addColorStop(0, "rgba(99, 102, 241, 0.12)");
        cursorGlow.addColorStop(0.4, "rgba(56, 189, 248, 0.05)");
        cursorGlow.addColorStop(1, "transparent");
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render and update Stars
      const nearMouseStars: Star[] = [];
      const mouseRadius = isMobile ? 100 : 160;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Twinkle calculation
        const twinkle = Math.sin(tick * s.twinkleSpeed + s.twinkleOffset);
        s.alpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle * 0.25));

        // Subtle ambient drifting drift
        if (!prefersReducedMotion) {
          s.originY -= 0.08 * s.depth;
          if (s.originY < -10) {
            s.originY = height + 10;
            s.originX = Math.random() * width;
          }
        }

        // Mouse attraction/deflection physics
        if (mouse.isActive && mouse.x > 0) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 1) {
            // Gravitational pull with subtle spring damping
            const force = (1 - dist / mouseRadius) * 1.8 * s.depth;
            const angle = Math.atan2(dy, dx);
            // Slight deflection + gentle pull
            s.vx += Math.cos(angle) * force * 0.18;
            s.vy += Math.sin(angle) * force * 0.18;

            if (dist < mouseRadius * 0.75) {
              nearMouseStars.push(s);
            }
          }
        }

        // Spring force returning star to origin
        const homeDx = s.originX - s.x;
        const homeDy = s.originY - s.y;
        s.vx += homeDx * 0.04;
        s.vy += homeDy * 0.04;

        // Damping
        s.vx *= 0.88;
        s.vy *= 0.88;

        s.x += s.vx;
        s.y += s.vy;

        // Draw star
        ctx.fillStyle = `${s.color}${s.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle cross-star halo on brighter foreground stars
        if (s.depth > 0.85 && s.alpha > 0.75) {
          ctx.fillStyle = `${s.color}${(s.alpha * 0.15).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw interactive constellation lines between stars near cursor
      if (nearMouseStars.length > 1 && !prefersReducedMotion) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < nearMouseStars.length; i++) {
          for (let j = i + 1; j < nearMouseStars.length; j++) {
            const p1 = nearMouseStars[i];
            const p2 = nearMouseStars[j];
            const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const maxLinkDist = isMobile ? 45 : 65;

            if (d < maxLinkDist) {
              const lineAlpha = (1 - d / maxLinkDist) * 0.35;
              ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha.toFixed(2)})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 5. Update and render particle velocity trails
      for (let i = dustParticles.length - 1; i >= 0; i--) {
        const p = dustParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.94;
        p.size *= 0.97;

        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha < 0.05 || p.size < 0.2) {
          dustParticles.splice(i, 1);
        }
      }

      // 6. Update and render cosmic click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4.5;
        r.alpha *= 0.96;

        ctx.strokeStyle = `rgba(125, 211, 252, ${r.alpha.toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary inner harmonic ring
        if (r.radius > 20) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${(r.alpha * 0.6).toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 7. Update and render shooting stars
      maybeSpawnShootingStar(Date.now());
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life++;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        starGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        starGrad.addColorStop(0.7, `rgba(186, 230, 253, ${(ss.alpha * 0.5).toFixed(2)})`);
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha.toFixed(2)})`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        if (ss.life > ss.maxLife) {
          ss.alpha -= 0.05;
        }

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }
    }

    // Auto-pause loop when page visibility changes to conserve battery/CPU
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial trigger
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 size-full transition-opacity duration-700"
    />
  );
}

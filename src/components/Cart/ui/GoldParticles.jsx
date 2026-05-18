import React, { useEffect, useRef } from "react";

const COLORS = ["#C9A96E", "#E8D5B0", "#F5EDD8", "#C2A05A", "#D4B87A"];

const GoldParticles = ({ trigger, anchorElement }) => {
  const canvasRef = useRef(null);
  const isMobile = window.innerWidth <= 430;
  const PARTICLE_COUNT = isMobile ? 22 : 28; // Mobile: 22, Desktop: 28

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get spawn position from anchor element (centre-top of feedback)
    let spawnX = canvas.width / 2;
    let spawnY = canvas.height * 0.6;

    if (anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      spawnX = rect.left + rect.width / 2;  // Centre horizontally
      spawnY = rect.top;                     // Top vertically
    }

    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isDiamond = i < PARTICLE_COUNT / 2; // 50/50 split

      particles.push({
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 2.4,           // ±1.2
        vy: -Math.random() * 5.2 - 1.2,            // -1.2 to -6.4 (upward burst)
        size: Math.random() * 3.5 + 1.5,           // 1.5px to 5px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.1,
        alpha: 1,
        shape: isDiamond ? "diamond" : "circle"
      });
    }

    let frame = 0;
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDead = true;

      particles.forEach(p => {
        if (p.alpha <= 0) return;

        allDead = false;

        // Apply gravity
        p.vy += 0.045;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.alpha -= 0.016;

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Diamond shape (rotated square)
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, 0);
          ctx.lineTo(0, p.size / 2);
          ctx.lineTo(-p.size / 2, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      frame++;

      if (!allDead && frame < 120) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [trigger, anchorElement, isMobile, PARTICLE_COUNT]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999
      }}
    />
  );
};

export default GoldParticles;
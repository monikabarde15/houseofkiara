import React, { useEffect, useRef } from "react";

const COLORS = [
  "#C9A96E",
  "#E8D5B0",
  "#F5EDD8",
  "#C2A05A",
  "#D4B87A"
];

const PARTICLE_COUNT = 28;

const GoldParticles = ({ trigger }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // spawn at center top (feedback area approx)
    const spawnX = canvas.width / 2;
    const spawnY = canvas.height * 0.6;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isDiamond = i % 2 === 0;

      particles.push({
        x: spawnX,
        y: spawnY,

        vx: (Math.random() - 0.5) * 2,      // -1.2 to 1.2 approx
        vy: -Math.random() * 4 - 1.2,       // upward burst

        size: Math.random() * 6 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],

        rotation: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.06,

        alpha: 1,
        shape: isDiamond ? "diamond" : "circle"
      });
    }

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // physics
        p.vy += 0.045; // gravity
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.vr;
        p.alpha -= 0.016;

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
          // diamond
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

      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

  }, [trigger]);

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
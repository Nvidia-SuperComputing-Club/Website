import React, { useEffect, useRef } from 'react';

export const CircuitCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const gridSize = 40;
    const particles = [];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
        vx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 2 : 0),
        vy: 0,
        life: 0,
        maxLife: 100 + Math.random() * 100,
        color: Math.random() > 0.3 ? '#76B900' : '#00E5FF'
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(118, 185, 0, 0.04)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x % gridSize === 0 && p.y % gridSize === 0 && Math.random() < 0.4) {
          if (p.vx !== 0) {
            p.vx = 0;
            p.vy = (Math.random() > 0.5 ? 2 : -2);
          } else {
            p.vy = 0;
            p.vx = (Math.random() > 0.5 ? 2 : -2);
          }
        }

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life > p.maxLife) {
          p.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
          p.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
          p.vx = (Math.random() > 0.5 ? 2 : -2);
          p.vy = 0;
          p.life = 0;
          p.color = Math.random() > 0.3 ? '#76B900' : '#00E5FF';
        }

        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full opacity-60"
    />
  );
};

import React, { useEffect, useRef } from 'react';

export default function MatrixRain({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters definition (mix of Japanese katakana, numbers, and alphabets)
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Track Y coordinate of rain drops for each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // staggered start above canvas
    }

    const draw = () => {
      // Semi-transparent black background to create trails
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#76B900'; // NVIDIA Green
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw character
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brightest highlight at the head of the drop
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#76B900';
        }

        ctx.fillText(char, x, y);

        // Move drop down
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="canvas-overlay absolute inset-0 w-full h-full bg-[#0A0A0A] opacity-90 transition-opacity duration-500" 
    />
  );
}

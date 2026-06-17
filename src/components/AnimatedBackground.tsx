/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid coordinates
    const spacing = 45;
    const points: { x: number; y: number; baseOffset: number; speed: number }[] = [];

    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        points.push({
          x,
          y,
          baseOffset: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.003
        });
      }
    }

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.5;
      ctx.fillStyle = '#05070A'; // Dark Bento Grid space base
      ctx.fillRect(0, 0, width, height);

      // Draw cyber matrix grid
      ctx.strokeStyle = 'rgba(12, 74, 110, 0.08)'; // Light sky/slate hue
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw faint glowing cyber nodes
      ctx.fillStyle = 'rgba(14, 116, 144, 0.25)'; // Teal glow dots
      points.forEach((pt, index) => {
        const offset = Math.sin(time * pt.speed + pt.baseOffset) * 4;
        const currentY = pt.y + offset;
        
        // Show only occasional glowing grid intersections
        if (index % 12 === 0) {
          ctx.beginPath();
          ctx.arc(pt.x, currentY, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Outer glowing shadow sweep
          if (index % 48 === 0) {
            ctx.fillStyle = 'rgba(14, 116, 144, 0.05)';
            ctx.beginPath();
            ctx.arc(pt.x, currentY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none" 
      id="animated-cyber-matrix-grid"
    />
  );
}

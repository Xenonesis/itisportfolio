"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface Dot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  isActive: boolean;
  animation: gsap.core.Tween | null;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 5,
  gap = 18,
  baseColor = "#5227FF",
  activeColor = "#5227FF",
  proximity = 120,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize dots grid
  const initDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const dots: Dot[] = [];

    // Calculate number of dots based on canvas size
    const cols = Math.ceil(width / gap) + 1;
    const rows = Math.ceil(height / gap) + 1;

    // Offset to center the grid
    const offsetX = ((cols - 1) * gap - width) / 2;
    const offsetY = ((rows - 1) * gap - height) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gap - offsetX;
        const y = row * gap - offsetY;
        dots.push({
          x,
          y,
          originX: x,
          originY: y,
          isActive: false,
          animation: null,
        });
      }
    }

    dotsRef.current = dots;
  }, [gap]);

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.hypot(x2 - x1, y2 - y1);
  };

  // Hex to RGBA conversion
  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(82, 39, 255, ${alpha})`;
    return `rgba(${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}, ${alpha})`;
  };

  // Draw all dots
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;

    dotsRef.current.forEach((dot) => {
      const distance = getDistance(mouse.x, mouse.y, dot.x, dot.y);
      const isNear = distance < proximity;

      // Activate dot if mouse is nearby
      if (isNear && !dot.isActive) {
        dot.isActive = true;
      } else if (!isNear && dot.isActive) {
        dot.isActive = false;
      }

      // Calculate color and size based on distance
      let currentColor = baseColor;
      let currentSize = dotSize;
      let alpha = 0.4;

      if (isNear) {
        const factor = 1 - distance / proximity;
        alpha = 0.4 + factor * 0.6;
        currentSize = dotSize + factor * 2;
        currentColor = activeColor;
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, currentSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(currentColor, alpha);
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [baseColor, activeColor, dotSize, proximity]);

  // Handle mouse movement with inertia
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mouse = mouseRef.current;

      // Calculate speed
      const dx = x - mouse.prevX;
      const dy = y - mouse.prevY;
      mouse.speed = Math.hypot(dx, dy);

      // Update mouse position
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = x;
      mouse.y = y;

      // Apply inertia effect on fast movement
      if (mouse.speed > speedTrigger) {
        const inertiaFactor = Math.min(mouse.speed / maxSpeed, 1);
        const pushDistance = resistance * inertiaFactor;

        dotsRef.current.forEach((dot) => {
          const distance = getDistance(x, y, dot.x, dot.y);
          if (distance < proximity * 1.5) {
            const angle = Math.atan2(dot.y - y, dot.x - x);
            const pushX = Math.cos(angle) * pushDistance * (1 - distance / (proximity * 1.5));
            const pushY = Math.sin(angle) * pushDistance * (1 - distance / (proximity * 1.5));

            // Cancel existing animation
            if (dot.animation) {
              dot.animation.kill();
            }

            // Push dot away
            dot.x += pushX * 0.1;
            dot.y += pushY * 0.1;

            // Animate back to origin
            dot.animation = gsap.to(dot, {
              x: dot.originX,
              y: dot.originY,
              duration: returnDuration,
              ease: "elastic.out(1, 0.3)",
            });
          }
        });
      }
    },
    [proximity, speedTrigger, maxSpeed, resistance, returnDuration]
  );

  // Handle click shockwave
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      dotsRef.current.forEach((dot) => {
        const distance = getDistance(x, y, dot.originX, dot.originY);
        if (distance < shockRadius) {
          const angle = Math.atan2(dot.originY - y, dot.originX - x);
          const force = (1 - distance / shockRadius) * shockStrength;
          const pushX = Math.cos(angle) * force * 15;
          const pushY = Math.sin(angle) * force * 15;

          // Cancel existing animation
          if (dot.animation) {
            dot.animation.kill();
          }

          // Push dot away
          dot.x = dot.originX + pushX;
          dot.y = dot.originY + pushY;

          // Animate back to origin with delay based on distance
          const delay = (distance / shockRadius) * 0.2;
          dot.animation = gsap.to(dot, {
            x: dot.originX,
            y: dot.originY,
            duration: returnDuration * 1.2,
            delay,
            ease: "elastic.out(1, 0.3)",
          });
        }
      });
    },
    [shockRadius, shockStrength, returnDuration]
  );

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update canvas size and reinitialize dots when dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    initDots();
  }, [dimensions, initDots]);

  // Start animation loop and add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Start drawing
    animationFrameRef.current = requestAnimationFrame(draw);

    // Add event listeners
    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("click", handleClick);
    };
  }, [draw, handleMouseMove, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        ...style,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default DotGrid;

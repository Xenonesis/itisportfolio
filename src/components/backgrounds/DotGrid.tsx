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
  targetX: number;
  targetY: number;
  scale: number;
  targetScale: number;
  alpha: number;
  targetAlpha: number;
  hue: number;
  animation: gsap.core.Tween | null;
}

// Smooth interpolation helper
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

// Parse hex color to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 82, g: 39, b: 255 };
  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
};

// Interpolate between two colors
const lerpColor = (color1: string, color2: string, factor: number) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return {
    r: Math.round(lerp(c1.r, c2.r, factor)),
    g: Math.round(lerp(c1.g, c2.g, factor)),
    b: Math.round(lerp(c1.b, c2.b, factor)),
  };
};

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
  const mouseRef = useRef({ 
    x: -1000, 
    y: -1000, 
    prevX: -1000, 
    prevY: -1000, 
    speed: 0,
    smoothX: -1000,
    smoothY: -1000
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);

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
          targetX: x,
          targetY: y,
          scale: 1,
          targetScale: 1,
          alpha: 0.35,
          targetAlpha: 0.35,
          hue: 0,
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

  // Draw all dots with smooth interpolation
  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Calculate delta time for consistent animation speed
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    timeRef.current += deltaTime * 0.001;

    // Smooth interpolation factor (higher = faster response)
    const smoothFactor = Math.min(deltaTime * 0.008, 0.15);
    const positionSmoothFactor = Math.min(deltaTime * 0.012, 0.2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;
    
    // Smooth mouse position
    mouse.smoothX = lerp(mouse.smoothX, mouse.x, smoothFactor * 2);
    mouse.smoothY = lerp(mouse.smoothY, mouse.y, smoothFactor * 2);

    dotsRef.current.forEach((dot) => {
      const distance = getDistance(mouse.smoothX, mouse.smoothY, dot.x, dot.y);
      const proximityFactor = Math.max(0, 1 - distance / proximity);
      const isNear = distance < proximity;

      // Calculate target values based on proximity
      if (isNear) {
        // Ease in with cubic function for smoother activation
        const easedFactor = proximityFactor * proximityFactor * (3 - 2 * proximityFactor);
        dot.targetAlpha = 0.35 + easedFactor * 0.65;
        dot.targetScale = 1 + easedFactor * 0.8;
        dot.hue = easedFactor;
        
        // Subtle magnetic effect - dots slightly attracted to cursor
        const angle = Math.atan2(mouse.smoothY - dot.y, mouse.smoothX - dot.x);
        const magnetStrength = easedFactor * 3;
        dot.targetX = dot.originX + Math.cos(angle) * magnetStrength;
        dot.targetY = dot.originY + Math.sin(angle) * magnetStrength;
      } else {
        dot.targetAlpha = 0.35;
        dot.targetScale = 1;
        dot.hue = 0;
        dot.targetX = dot.originX;
        dot.targetY = dot.originY;
      }

      // Smooth interpolation for all properties
      dot.alpha = lerp(dot.alpha, dot.targetAlpha, smoothFactor);
      dot.scale = lerp(dot.scale, dot.targetScale, smoothFactor);
      dot.x = lerp(dot.x, dot.targetX, positionSmoothFactor);
      dot.y = lerp(dot.y, dot.targetY, positionSmoothFactor);

      // Color interpolation
      const color = lerpColor(baseColor, activeColor, dot.hue);
      
      // Calculate final size with subtle breathing effect
      const breathe = Math.sin(timeRef.current * 0.5 + dot.originX * 0.01 + dot.originY * 0.01) * 0.1;
      const finalSize = (dotSize * dot.scale * (1 + breathe)) / 2;

      // Draw dot with glow effect for active dots
      if (dot.hue > 0.1) {
        // Outer glow
        const glowSize = finalSize * (1 + dot.hue * 1.5);
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, glowSize * 2
        );
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${dot.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, glowSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw main dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, finalSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${dot.alpha})`;
      ctx.fill();
    });

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [baseColor, activeColor, dotSize, proximity]);

  // Handle mouse movement with smooth tracking
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

      // Apply wave effect on fast movement
      if (mouse.speed > speedTrigger) {
        const inertiaFactor = Math.min(mouse.speed / maxSpeed, 1);
        const pushDistance = resistance * inertiaFactor;
        const waveRadius = proximity * 2;

        dotsRef.current.forEach((dot) => {
          const distance = getDistance(x, y, dot.originX, dot.originY);
          if (distance < waveRadius) {
            const angle = Math.atan2(dot.originY - y, dot.originX - x);
            const distanceFactor = 1 - distance / waveRadius;
            const easeOut = distanceFactor * distanceFactor;
            const pushX = Math.cos(angle) * pushDistance * easeOut * 0.15;
            const pushY = Math.sin(angle) * pushDistance * easeOut * 0.15;

            // Cancel existing animation
            if (dot.animation) {
              dot.animation.kill();
            }

            // Set new target position
            dot.targetX = dot.originX + pushX;
            dot.targetY = dot.originY + pushY;

            // Animate back to origin with smooth easing
            dot.animation = gsap.to(dot, {
              targetX: dot.originX,
              targetY: dot.originY,
              duration: returnDuration,
              ease: "power3.out",
              delay: distance / waveRadius * 0.1,
            });
          }
        });
      }
    },
    [proximity, speedTrigger, maxSpeed, resistance, returnDuration]
  );

  // Handle click ripple effect
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple wave
      dotsRef.current.forEach((dot) => {
        const distance = getDistance(x, y, dot.originX, dot.originY);
        if (distance < shockRadius) {
          const angle = Math.atan2(dot.originY - y, dot.originX - x);
          const distanceFactor = 1 - distance / shockRadius;
          // Smooth wave shape using sine
          const waveShape = Math.sin(distanceFactor * Math.PI);
          const force = waveShape * shockStrength;
          const pushX = Math.cos(angle) * force * 12;
          const pushY = Math.sin(angle) * force * 12;

          // Cancel existing animation
          if (dot.animation) {
            dot.animation.kill();
          }

          // Set target position for ripple
          dot.targetX = dot.originX + pushX;
          dot.targetY = dot.originY + pushY;

          // Animate with wave delay for ripple effect
          const delay = (distance / shockRadius) * 0.15;
          
          dot.animation = gsap.to(dot, {
            targetX: dot.originX,
            targetY: dot.originY,
            duration: returnDuration * 1.5,
            delay,
            ease: "elastic.out(0.8, 0.4)",
          });
        }
      });
    },
    [shockRadius, shockStrength, returnDuration]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    mouseRef.current.smoothX = -1000;
    mouseRef.current.smoothY = -1000;
  }, []);

  // Handle resize with debounce
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const updateDimensions = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({
          width: globalThis.innerWidth,
          height: globalThis.innerHeight,
        });
      }, 100);
    };

    updateDimensions();
    globalThis.addEventListener("resize", updateDimensions);
    return () => {
      globalThis.removeEventListener("resize", updateDimensions);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Update canvas size and reinitialize dots when dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    // Set canvas resolution for crisp rendering
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    initDots();
  }, [dimensions, initDots]);

  // Start animation loop and add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    lastTimeRef.current = performance.now();
    
    // Start drawing
    animationFrameRef.current = requestAnimationFrame(draw);

    // Add event listeners
    globalThis.addEventListener("mousemove", handleMouseMove, { passive: true });
    globalThis.addEventListener("click", handleClick, { passive: true });
    globalThis.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("click", handleClick);
      globalThis.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [draw, handleMouseMove, handleClick, handleMouseLeave]);

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

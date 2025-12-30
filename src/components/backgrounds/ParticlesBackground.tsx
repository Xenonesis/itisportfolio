"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import to avoid SSR issues with WebGL
const Particles = dynamic(() => import('./Particles'), {
  ssr: false,
  loading: () => null
});

export const ParticlesBackground = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check the actual class on the document element
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Observe changes to the class attribute
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Colors suitable for both light and dark themes
  const lightModeColors = ['#14b8a6', '#06b6d4', '#8b5cf6', '#a1a1aa'];
  const darkModeColors = ['#2dd4bf', '#22d3ee', '#a78bfa', '#ffffff'];

  return (
    <Particles
      particleCount={150}
      particleSpread={12}
      speed={0.08}
      particleColors={isDark ? darkModeColors : lightModeColors}
      moveParticlesOnHover={true}
      particleHoverFactor={0.5}
      alphaParticles={true}
      particleBaseSize={80}
      sizeRandomness={0.8}
      cameraDistance={25}
      disableRotation={false}
      className="particles-bg"
    />
  );
};

export default ParticlesBackground;

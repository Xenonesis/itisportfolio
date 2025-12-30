"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import to avoid SSR issues
const DotGrid = dynamic(() => import("./DotGrid"), {
  ssr: false,
  loading: () => null,
});

export const DotGridBackground = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check the actual class on the document element
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Initial check
    checkTheme();

    // Observe changes to the class attribute
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Theme-aware colors - refined for smooth visual experience
  const lightConfig = {
    baseColor: "#a1a1aa", // zinc-400 - softer gray for better visibility
    activeColor: "#0d9488", // teal-600 - richer teal
  };

  const darkConfig = {
    baseColor: "#52525b", // zinc-600 - brighter for dark mode
    activeColor: "#2dd4bf", // teal-400 - vibrant teal
  };

  const config = isDark ? darkConfig : lightConfig;

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <DotGrid
      dotSize={5}
      gap={24}
      baseColor={config.baseColor}
      activeColor={config.activeColor}
      proximity={140}
      speedTrigger={60}
      shockRadius={280}
      shockStrength={5}
      resistance={500}
      returnDuration={1.8}
      className="dot-grid-bg"
    />
  );
};

export default DotGridBackground;

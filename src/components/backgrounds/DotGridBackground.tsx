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

  useEffect(() => {
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

  // Theme-aware colors - softer, more subtle for portfolio
  const lightConfig = {
    baseColor: "#d4d4d8", // zinc-300 - subtle gray
    activeColor: "#14b8a6", // teal-500 - matches your accent
  };

  const darkConfig = {
    baseColor: "#3f3f46", // zinc-700 - subtle dark gray
    activeColor: "#2dd4bf", // teal-400 - matches your accent
  };

  const config = isDark ? darkConfig : lightConfig;

  return (
    <DotGrid
      dotSize={4}
      gap={22}
      baseColor={config.baseColor}
      activeColor={config.activeColor}
      proximity={100}
      speedTrigger={80}
      shockRadius={200}
      shockStrength={4}
      resistance={600}
      returnDuration={1.2}
      className="dot-grid-bg"
    />
  );
};

export default DotGridBackground;

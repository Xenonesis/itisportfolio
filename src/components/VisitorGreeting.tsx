"use client";

import { useState, useEffect } from "react";

interface SystemInfo {
  browser: string;
  os: string;
  browserIcon: string;
  osIcon: string;
  message: string;
}

// Real SVG logo URLs
const browserLogos: Record<string, string> = {
  Chrome: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg",
  Firefox: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg",
  Safari: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg",
  Edge: "https://res.cloudinary.com/nicepages/image/upload/c_scale,w_48/v1702972217/microsoft-edge-logo-2023_rnxl8f.png",
  Opera: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg",
  Brave: "https://upload.wikimedia.org/wikipedia/commons/5/51/Brave_icon_lionface.png",
  Browser: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg",
};

const osLogos: Record<string, string> = {
  Windows: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg",
  macOS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
  Linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  Android: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
  iOS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg",
  System: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
};

const detectSystem = (): SystemInfo => {
  if (typeof window === "undefined") {
    return {
      browser: "Browser",
      os: "System",
      browserIcon: browserLogos.Browser,
      osIcon: osLogos.System,
      message: "Welcome, fellow developer!",
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || "";

  // Detect Browser
  let browser = "Browser";
  let browserIcon = browserLogos.Browser;

  if (userAgent.includes("edg/") || userAgent.includes("edge")) {
    browser = "Edge";
    browserIcon = browserLogos.Edge;
  } else if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
    browser = "Chrome";
    browserIcon = browserLogos.Chrome;
  } else if (userAgent.includes("firefox")) {
    browser = "Firefox";
    browserIcon = browserLogos.Firefox;
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    browser = "Safari";
    browserIcon = browserLogos.Safari;
  } else if (userAgent.includes("opera") || userAgent.includes("opr")) {
    browser = "Opera";
    browserIcon = browserLogos.Opera;
  } else if (userAgent.includes("brave")) {
    browser = "Brave";
    browserIcon = browserLogos.Brave;
  }

  // Detect OS
  let os = "System";
  let osIcon = osLogos.System;

  if (userAgent.includes("win") || platform.includes("win")) {
    os = "Windows";
    osIcon = osLogos.Windows;
  } else if (userAgent.includes("mac") || platform.includes("mac")) {
    os = "macOS";
    osIcon = osLogos.macOS;
  } else if (userAgent.includes("linux") && !userAgent.includes("android")) {
    os = "Linux";
    osIcon = osLogos.Linux;
  } else if (userAgent.includes("android")) {
    os = "Android";
    osIcon = osLogos.Android;
  } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    os = "iOS";
    osIcon = osLogos.iOS;
  }

  // Generate personalized message
  const messages: Record<string, string> = {
    "Chrome-Windows": "A classic combo! Solid choice for development.",
    "Chrome-macOS": "The Apple + Chrome power user setup!",
    "Chrome-Linux": "Chrome on Linux? You mean business!",
    "Firefox-Windows": "Ah, a fellow privacy-conscious developer!",
    "Firefox-macOS": "Firefox on Mac – elegant and private!",
    "Firefox-Linux": "The true open-source enthusiast setup!",
    "Safari-macOS": "Full Apple ecosystem! Sleek and seamless.",
    "Edge-Windows": "Microsoft's own! Nice Chromium integration.",
    "Brave-Windows": "Privacy + crypto-friendly. Nice!",
    "Brave-macOS": "Privacy-first on Mac! Respect.",
    "Brave-Linux": "Maximum privacy combo detected!",
  };

  const key = `${browser}-${os}`;
  const message = messages[key] || `Nice ${browser} on ${os} setup!`;

  return { browser, os, browserIcon, osIcon, message };
};

export const VisitorGreeting = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const info = detectSystem();
    setSystemInfo(info);
    // Small delay for entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!systemInfo) return null;

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <img src={systemInfo.osIcon} alt={systemInfo.os} className="w-5 h-5 object-contain" />
          <img
            src={systemInfo.browserIcon}
            alt={systemInfo.browser}
            className="w-5 h-5 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/20">
              {systemInfo.os}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 text-teal-700 dark:text-teal-400 border border-teal-500/20">
              {systemInfo.browser}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <span className="text-zinc-400 dark:text-zinc-500">→</span> {systemInfo.message}
      </p>
    </div>
  );
};

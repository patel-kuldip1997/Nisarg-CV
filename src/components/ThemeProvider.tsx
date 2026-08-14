"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundAnimation: string;
  enableParallax: boolean;
  cardStyle: string;
  borderRadius: string;
  buttonStyle: string;
};

const ThemeContext = createContext<ThemeSettings | null>(null);

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setTheme(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.primaryColor);
      root.style.setProperty('--secondary', theme.secondaryColor);
      root.style.setProperty('--accent', theme.accentColor);
      root.style.setProperty('--background', theme.backgroundColor);
      root.style.setProperty('--radius', theme.borderRadius);
    }
    
    // We can map fontFamily if needed (e.g., swapping class on body)
  }, [theme]);

  if (!theme) return <>{children}</>;

  return (
    <ThemeContext.Provider value={theme}>
      {/* Dynamic Backgrounds */}
      {theme.backgroundAnimation === "mesh" && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-none" 
          style={{
            backgroundColor: theme.backgroundColor,
            backgroundImage: `radial-gradient(circle at 15% 50%, ${theme.primaryColor}25, transparent 30%), radial-gradient(circle at 85% 30%, ${theme.secondaryColor}25, transparent 30%)`,
            animation: 'pulse-bg 15s ease-in-out infinite alternate'
          }} 
        />
      )}
      {theme.backgroundAnimation === "waves" && (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
           <motion.div 
             animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }} 
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-20 left-0 w-full h-64 blur-3xl"
             style={{ background: `linear-gradient(to right, transparent, ${theme.primaryColor}40, ${theme.secondaryColor}40, transparent)` }}
           />
        </div>
      )}
      {theme.backgroundAnimation === "particles" && (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
          {/* Simple CSS particles simulation for now, you can upgrade to tsparticles later */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />
        </div>
      )}
      {theme.backgroundAnimation === "none" && (
        <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ backgroundColor: theme.backgroundColor }} />
      )}
      
      {/* Render App Content */}
      <div className={`theme-${theme.cardStyle} font-${theme.fontFamily.toLowerCase()}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

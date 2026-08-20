"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

export type ThemeSettings = any;

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

      // Dynamic Google Font Loader
      if (theme.fontFamily) {
        const fontId = 'dynamic-google-font';
        let link = document.getElementById(fontId) as HTMLLinkElement;
        
        const formattedFont = theme.fontFamily.replace(/ /g, '+');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800;900&display=swap`;
        
        if (!link) {
          link = document.createElement('link');
          link.id = fontId;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        
        if (link.href !== fontUrl) {
          link.href = fontUrl;
        }
        
        document.body.style.setProperty('--font-primary', `"${theme.fontFamily}", sans-serif`);
        document.body.style.fontFamily = 'var(--font-primary)';
      }

      
      // Extended Colors
      root.style.setProperty('--success', theme.successColor || '#22c55e');
      root.style.setProperty('--warning', theme.warningColor || '#f59e0b');
      root.style.setProperty('--error', theme.errorColor || '#ef4444');
      root.style.setProperty('--info', theme.infoColor || '#3b82f6');
      root.style.setProperty('--surface', theme.surfaceColor || '#0a0a0a');
      
      // Function to calculate brightness of hex color
      const getBrightness = (hex: string) => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >>  8) & 0xff;
        const b = (rgb >>  0) & 0xff;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const isLight = getBrightness(theme.backgroundColor || '#050505') > 128;
      document.body.style.setProperty('--text', isLight ? '#0f172a' : '#f8fafc');
      document.body.style.setProperty('--text-muted', isLight ? '#475569' : '#94a3b8');
      
      // Inject UI Shape Engine attributes
      document.body.setAttribute('data-card-style', theme.cardStyle || 'glassmorphism');
      document.body.setAttribute('data-button-style', theme.buttonStyle || 'filled');
      
      // Inject V2 Pro Engine attributes
      document.body.setAttribute('data-navbar-style', theme.navbarStyle || 'floating');
      document.body.setAttribute('data-cursor-style', theme.cursorStyle || 'default');
      document.body.setAttribute('data-layout-width', theme.layoutWidth || 'max-w-7xl');
      document.body.setAttribute('data-glow-intensity', theme.glowIntensity || 'medium');
      document.body.setAttribute('data-text-reveal', theme.textReveal || 'fade');
      document.body.setAttribute('data-section-spacing', theme.sectionSpacing || 'normal');
      document.body.setAttribute('data-shadow-style', theme.shadowStyle || 'soft');
      document.body.setAttribute('data-border-width', theme.borderWidth || '1px');
      document.body.setAttribute('data-backdrop-blur', theme.backdropBlur || 'md');
      document.body.setAttribute('data-page-transition', theme.pageTransition || 'fade');
      document.body.setAttribute('data-image-style', theme.imageStyle || 'rounded');
      
      // Inject V3 Ultimate attributes
      document.body.setAttribute('data-font-weight', theme.headingFontWeight || 'bold');
      document.body.setAttribute('data-body-weight', theme.bodyFontWeight || 'normal');
      document.body.setAttribute('data-letter-spacing', theme.letterSpacing || 'normal');
      document.body.setAttribute('data-line-height', theme.lineHeight || 'relaxed');
      document.body.setAttribute('data-text-transform', theme.textTransform || 'none');
      
      document.body.setAttribute('data-btn-padding', theme.buttonPadding || 'normal');
      document.body.setAttribute('data-btn-hover', theme.buttonHoverEffect || 'lift');
      document.body.setAttribute('data-btn-icon', theme.buttonIconPosition || 'right');
      document.body.setAttribute('data-btn-anim', theme.buttonAnimation || 'pulse');
      document.body.setAttribute('data-btn-shadow', theme.buttonShadow || 'none');
      
      document.body.setAttribute('data-nav-height', theme.navbarHeight || 'normal');
      document.body.setAttribute('data-nav-blur', theme.navbarBlurIntensity || 'md');
      document.body.setAttribute('data-nav-hover', theme.navbarHoverEffect || 'glow');
      document.body.setAttribute('data-nav-dropdown', theme.navbarDropdownStyle || 'modern');
      document.body.setAttribute('data-logo-size', theme.logoSize || 'normal');
      
      document.body.setAttribute('data-card-padding', theme.cardPadding || 'normal');
      document.body.setAttribute('data-card-lift', theme.cardHoverLift || 'medium');
      document.body.setAttribute('data-card-ratio', theme.cardImageRatio || 'video');
      document.body.setAttribute('data-card-border-accent', theme.cardBorderAccent || 'none');
      document.body.setAttribute('data-card-glow', theme.cardGlowIntensity || 'none');
      
      document.body.setAttribute('data-footer-style', theme.footerStyle || 'modern');
      document.body.setAttribute('data-footer-cols', theme.footerColumns || '4');
      document.body.setAttribute('data-content-align', theme.contentAlignment || 'left');
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
      {theme.backgroundAnimation === "grid" && (
        <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ 
          backgroundColor: theme.backgroundColor,
          backgroundImage: `linear-gradient(to right, ${theme.primaryColor}15 1px, transparent 1px), linear-gradient(to bottom, ${theme.primaryColor}15 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }} />
      )}
      
      {/* Render App Content */}
      <div className={`theme-${theme.cardStyle} font-${theme.fontFamily.toLowerCase()}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

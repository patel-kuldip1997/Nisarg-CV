"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exclude admin routes
  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: pathname === "/" ? "#home" : "/#home" },
    { name: "Skills", path: pathname === "/" ? "#skills" : "/#skills" },
    { name: "Experience", path: pathname === "/" ? "#experience" : "/#experience" },
    { name: "Education", path: pathname === "/" ? "#education" : "/#education" },
    { name: "Projects", path: pathname === "/" ? "#projects" : "/#projects" },
  ];

  const navStyle = theme?.navbarStyle || 'floating';
  const navHeight = theme?.navbarHeight || 'normal';
  const blurIntensity = theme?.navbarBlurIntensity || 'md';
  const dropdownStyle = theme?.navbarDropdownStyle || 'fullscreen';

  // Dynamic Height Classes
  const pyClass = navHeight === 'compact' ? 'py-2' : navHeight === 'tall' ? 'py-6' : 'py-4';
  
  // Dynamic Blur Classes
  const blurClass = blurIntensity === 'none' ? 'backdrop-blur-none bg-[var(--surface)]' : 
                    blurIntensity === 'heavy' ? 'backdrop-blur-2xl bg-[var(--background)]/70' : 
                    'backdrop-blur-md bg-[var(--background)]/80';

  // Dynamic Navbar Wrapper Classes
  let navWrapperClass = `fixed w-full z-50 transition-all duration-300 ${pyClass} `;
  let navInnerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

  if (navStyle === 'floating') {
    navWrapperClass += scrolled 
      ? `top-4 max-w-6xl left-1/2 -translate-x-1/2 ${blurClass} border border-[var(--border)] rounded-full shadow-lg` 
      : 'top-0 bg-transparent';
    navInnerClass = "px-6";
  } else if (navStyle === 'sticky') {
    navWrapperClass += scrolled 
      ? `top-0 ${blurClass} border-b border-[var(--border)] shadow-md` 
      : 'top-0 bg-transparent';
  } else if (navStyle === 'minimal') {
    navWrapperClass += scrolled 
      ? 'top-0 bg-[var(--background)] shadow-sm' 
      : 'top-0 bg-transparent';
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={navWrapperClass}
      >
        <div className={navInnerClass}>
          <div className="flex justify-between items-center">
            
            <Link href={pathname === "/" ? "#home" : "/"} className="text-2xl font-black tracking-tighter flex items-center gap-2">
              {theme?.logoType === 'image' && theme?.logoImageUrl ? (
                <img src={theme.logoImageUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-[var(--text)]">
                  {theme?.logoText ? (
                    <>
                      <span className="text-[var(--primary)]">{theme.logoText.charAt(0)}</span>
                      {theme.logoText.slice(1)}
                    </>
                  ) : (
                    <><span className="text-[var(--primary)]">K</span>P.</>
                  )}
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  className="text-sm font-medium transition-colors hover:text-[var(--primary)] text-[var(--text-muted)]"
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" className="btn-primary py-2 px-6" style={{ borderRadius: 'var(--radius)' }}>
                Hire Me
              </a>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-[var(--text)] hover:text-[var(--primary)] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlays */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {dropdownStyle === 'fullscreen' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] bg-[var(--surface-elevated)] backdrop-blur-xl flex flex-col p-6 md:hidden"
              >
                <div className="flex justify-end">
                  <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--text)] hover:text-[var(--primary)] p-2">
                    <X size={28} />
                  </button>
                </div>
                <div className="flex flex-col gap-8 mt-16 items-center text-3xl font-bold">
                  {navLinks.map((link) => (
                    <a key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                      {link.name}
                    </a>
                  ))}
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn-primary mt-8 text-xl w-full max-w-xs text-center" style={{ borderRadius: 'var(--radius)' }}>
                    Hire Me
                  </a>
                </div>
              </motion.div>
            )}

            {dropdownStyle === 'sidebar' && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-[50]" onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm z-[60] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col p-6"
                >
                  <div className="flex justify-end border-b border-[var(--border)] pb-4">
                    <button onClick={() => setMobileMenuOpen(false)} className="text-[var(--text)] hover:text-[var(--primary)]">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-6 mt-8 text-xl font-semibold">
                    {navLinks.map((link) => (
                      <a key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} className="text-[var(--text)] hover:text-[var(--primary)] transition-colors block border-b border-[var(--border)] pb-4">
                        {link.name}
                      </a>
                    ))}
                    <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn-primary mt-4 w-full text-center" style={{ borderRadius: 'var(--radius)' }}>
                      Hire Me
                    </a>
                  </div>
                </motion.div>
              </>
            )}

            {dropdownStyle === 'modern' && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]" onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="fixed top-24 left-4 right-4 z-[60] bg-[var(--surface-elevated)] border border-[var(--border)] shadow-2xl p-4 flex flex-col"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {navLinks.map((link) => (
                      <a key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} className="text-center p-3 text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors" style={{ borderRadius: 'calc(var(--radius) / 2)' }}>
                        {link.name}
                      </a>
                    ))}
                  </div>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn-primary mt-4 w-full text-center" style={{ borderRadius: 'calc(var(--radius) / 2)' }}>
                    Hire Me
                  </a>
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}

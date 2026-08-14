"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
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
    { name: "Home", path: "#home" },
    { name: "Skills", path: "#skills" },
    { name: "Experience", path: "#experience" },
    { name: "Education", path: "#education" },
    { name: "Projects", path: "#projects" },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            <Link href="#home" className="text-2xl font-black tracking-tighter text-white">
              <span className="text-primary">K</span>P.
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  className="text-sm font-medium transition-colors hover:text-primary text-text-muted hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" className="btn-primary py-2 px-6">
                Hire Me
              </a>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-text hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-surface-elevated/95 backdrop-blur-xl flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-text hover:text-primary p-2">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-6 mt-12 items-center text-2xl font-semibold">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn-primary mt-4 text-lg w-full max-w-xs text-center">
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

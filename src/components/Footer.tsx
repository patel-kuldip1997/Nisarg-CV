"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Link as LinkIcon, Mail, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => setProfile(data));
  }, []);

  if (pathname.startsWith("/admin") || !profile) return null;

  const getInitials = (name: string) => {
    if (!name) return "KP";
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };
  const initials = getInitials(profile.name);

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-background overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="dynamic-container py-20">
        
        {/* Top Section: CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 pb-16 border-b border-white/5 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4 tracking-tight">Let's build together.</h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Open for new opportunities and exciting projects. If you're looking for a dedicated professional, let's talk.
            </p>
          </div>
          <a href="#contact" className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95">
            Get in touch
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-start mb-16">
          
          {/* Brand & Intro */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="#home" className="text-3xl font-black tracking-tighter text-[var(--text)] mb-6 inline-block">
              <span className="text-primary">{initials[0]}</span>{initials.substring(1)}.
            </Link>
            <h3 className="text-xl font-bold text-[var(--text)] mb-2 tracking-tight">{profile.name}</h3>
            <p className="text-text-muted font-medium mb-6 text-sm">{profile.primaryTitle}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Available for work
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 lg:justify-self-center">
            <h4 className="text-xs uppercase tracking-widest text-[var(--text)]/40 font-bold mb-6">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Skills', 'Experience', 'Projects', 'Education'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-[var(--text)]/70 hover:text-[var(--text)] transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-4 lg:col-span-5 lg:justify-self-end">
            <h4 className="text-xs uppercase tracking-widest text-[var(--text)]/40 font-bold mb-6">Connect</h4>
            <div className="flex flex-col space-y-4">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text)]/70 hover:text-[var(--text)] transition-colors text-sm font-medium group">
                  <LinkIcon size={18} className="text-[var(--text)]/40 group-hover:text-primary transition-colors" />
                  LinkedIn
                  <ArrowUpRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text)]/70 hover:text-[var(--text)] transition-colors text-sm font-medium group">
                  <Code size={18} className="text-[var(--text)]/40 group-hover:text-primary transition-colors" />
                  GitHub
                  <ArrowUpRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-[var(--text)]/70 hover:text-[var(--text)] transition-colors text-sm font-medium group">
                  <Mail size={18} className="text-[var(--text)]/40 group-hover:text-primary transition-colors" />
                  {profile.email}
                  <ArrowUpRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </a>
              )}
            </div>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 text-sm text-primary hover:text-[var(--text)] font-medium transition-colors underline-offset-8 hover:underline">
                Download Full Resume
              </a>
            )}
          </div>
          
        </div>
        
        {/* Copyright & Back to Top */}
        <div className="border-t border-white/5 pt-8 flex justify-between items-center text-xs text-[var(--text)]/40 font-medium tracking-wide">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2 hover:text-[var(--text)] transition-colors"
          >
            Back to Top <ArrowUpRight size={14} className="rotate-[-45deg]" />
          </button>
        </div>

      </div>
    </footer>
  );
}

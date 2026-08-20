"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Code2, Layers, Target, Lightbulb, Zap, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ProjectClient({ project }: { project: any }) {
  // Ensure we start at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const technologies = project.technologies ? project.technologies.split(',').map((t: string) => t.trim()) : [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] dynamic-page-wrapper">
      
      {/* Dynamic Background */}
      <div className="bg-gradient-mesh"></div>

      <div className="dynamic-container dynamic-section relative z-10 pt-32 pb-24">
        
        {/* Back Button */}
        <Link href="/#projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-semibold uppercase tracking-widest text-sm">Back to Projects</span>
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dynamic-content mb-16"
        >
          <span className="px-4 py-1.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] text-sm font-semibold mb-6 inline-block bg-[var(--primary)]/10">
            {project.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{project.title}</h1>
          <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed">
            {project.shortDesc}
          </p>
        </motion.div>

        {/* Action Buttons & Tech Stack */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center mb-24 border-b border-[var(--border)] pb-12"
        >
          <div className="flex flex-wrap gap-2 max-w-2xl">
            {technologies.map((tech: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 lg:flex-none">
                Live Demo <ExternalLink size={18} className="ml-2" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 lg:flex-none">
                Source Code <Code2 size={18} className="ml-2" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Main Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-16">
            
            {project.problem && (
              <motion.section initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--error)]/10 text-[var(--error)] rounded-xl"><Target size={24} /></div>
                  <h2 className="text-3xl font-bold">The Challenge</h2>
                </div>
                <div className="glass-card bg-[var(--surface-elevated)]/30 border border-[var(--border)] p-8 text-lg leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                  {project.problem}
                </div>
              </motion.section>
            )}

            {project.solution && (
              <motion.section initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--success)]/10 text-[var(--success)] rounded-xl"><Lightbulb size={24} /></div>
                  <h2 className="text-3xl font-bold">The Solution</h2>
                </div>
                <div className="glass-card bg-[var(--surface-elevated)]/30 border border-[var(--border)] p-8 text-lg leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                  {project.solution}
                </div>
              </motion.section>
            )}

            {project.architecture && (
              <motion.section initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl"><Layers size={24} /></div>
                  <h2 className="text-3xl font-bold">Architecture</h2>
                </div>
                <div className="glass-card bg-[var(--surface-elevated)]/30 border border-[var(--border)] p-8 text-lg leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                  {project.architecture}
                </div>
              </motion.section>
            )}

            {project.results && (
              <motion.section initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl"><Rocket size={24} /></div>
                  <h2 className="text-3xl font-bold">Key Results</h2>
                </div>
                <div className="glass-card bg-[var(--surface-elevated)]/30 border border-[var(--border)] p-8 text-lg leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
                  {project.results}
                </div>
              </motion.section>
            )}

          </div>

          {/* Right Column: Visuals & Challenges */}
          <div className="lg:col-span-5 space-y-16">
            
            {project.imageUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="sticky top-32">
                <div className="glass-card border border-[var(--border)] p-2 bg-[var(--surface-elevated)] shadow-2xl rounded-2xl overflow-hidden">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-auto dynamic-img object-cover rounded-xl" />
                </div>
                
                {project.challenges && (
                  <div className="mt-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-xl"><Zap size={24} /></div>
                      <h2 className="text-2xl font-bold">Roadblocks Overcome</h2>
                    </div>
                    <div className="p-6 bg-[var(--surface-elevated)]/50 border-l-4 border-[var(--warning)] text-[var(--text-muted)] rounded-r-xl whitespace-pre-line">
                      {project.challenges}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

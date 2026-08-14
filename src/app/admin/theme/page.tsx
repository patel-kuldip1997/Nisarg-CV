"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, Monitor, Palette, Sparkles, Layers, Type, ArrowRight, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FigmaThemeCustomizer() {
  const [formData, setFormData] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#10b981",
    backgroundColor: "#050505",
    fontFamily: "Inter",
    backgroundAnimation: "mesh",
    enableParallax: true,
    cardStyle: "glassmorphism",
    borderRadius: "8px",
    buttonStyle: "filled"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setFormData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCustomSelect = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Theme settings saved! Refresh the frontend to see changes.");
      } else {
        toast.error("Failed to update theme.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading design workspace...</div>;

  // Real-time preview CSS variables
  const previewStyle = {
    '--primary': formData.primaryColor,
    '--secondary': formData.secondaryColor,
    '--accent': formData.accentColor,
    '--background': formData.backgroundColor,
    '--radius': formData.borderRadius,
  } as React.CSSProperties;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row gap-6 -m-4 md:-m-8">
      
      {/* LEFT PANE: FIGMA-STYLE CONTROLS */}
      <div className="w-full md:w-[380px] shrink-0 bg-surface border-r border-border h-full overflow-y-auto flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="p-5 border-b border-border sticky top-0 bg-surface/80 backdrop-blur-xl z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h1 className="font-semibold text-white">Design Settings</h1>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
          >
            <Save size={14} /> {saving ? "Saving..." : "Publish"}
          </button>
        </div>

        {/* Control Sections */}
        <div className="p-5 space-y-8">
          
          {/* Colors */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                <Palette size={14} /> Global Colors
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'primaryColor', label: 'Primary' },
                { id: 'secondaryColor', label: 'Secondary' },
                { id: 'accentColor', label: 'Accent (Glows)' },
                { id: 'backgroundColor', label: 'Background' }
              ].map((color) => (
                <div key={color.id} className="flex items-center justify-between group">
                  <span className="text-sm text-white/80">{color.label}</span>
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-md border border-border p-1 group-hover:border-primary/50 transition-colors">
                    <input 
                      type="color" 
                      name={color.id} 
                      value={(formData as any)[color.id]} 
                      onChange={handleChange} 
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0" 
                    />
                    <input 
                      type="text" 
                      name={color.id} 
                      value={(formData as any)[color.id].toUpperCase()} 
                      onChange={handleChange} 
                      className="w-16 bg-transparent text-xs text-white uppercase focus:outline-none" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          {/* Typography */}
          <section>
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type size={14} /> Typography
            </h2>
            <div className="bg-surface-elevated rounded-md border border-border overflow-hidden">
              <select 
                name="fontFamily" 
                value={formData.fontFamily} 
                onChange={handleChange} 
                className="w-full bg-transparent px-3 py-2 text-sm text-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="Inter" className="bg-surface text-white">Inter (Clean UI)</option>
                <option value="Outfit" className="bg-surface text-white">Outfit (Modern Bold)</option>
                <option value="Roboto" className="bg-surface text-white">Roboto (Classic)</option>
                <option value="JetBrains Mono" className="bg-surface text-white">JetBrains (Developer)</option>
              </select>
            </div>
          </section>

          <hr className="border-border" />

          {/* Geometry (Border Radius) */}
          <section>
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers size={14} /> Geometry
            </h2>
            
            <span className="text-xs text-white/60 mb-2 block">Corner Radius</span>
            <div className="flex bg-surface-elevated rounded-md border border-border p-1 gap-1">
              {[
                { label: '0px', val: '0px' },
                { label: '4px', val: '4px' },
                { label: '8px', val: '8px' },
                { label: '16px', val: '16px' },
                { label: 'Pill', val: '999px' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => handleCustomSelect('borderRadius', opt.val)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${formData.borderRadius === opt.val ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          {/* VFX Engine */}
          <section>
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} /> VFX Engine
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-white/60 mb-2 block">Background Simulation</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'Solid' },
                    { id: 'mesh', label: 'Mesh' },
                    { id: 'waves', label: 'Waves' },
                    { id: 'particles', label: 'Particles' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleCustomSelect('backgroundAnimation', opt.id)}
                      className={`py-2 text-xs font-medium rounded-md border transition-all ${formData.backgroundAnimation === opt.id ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-elevated border-border text-text-muted hover:border-white/20'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-surface-elevated p-3 rounded-md border border-border">
                <span className="text-sm text-white/80 flex items-center gap-2">
                  <MousePointer2 size={14} /> Parallax 3D
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="enableParallax" checked={formData.enableParallax} onChange={handleChange} className="sr-only peer" />
                  <div className="w-8 h-4 bg-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT PANE: LIVE PREVIEW CANVAS */}
      <div className="flex-1 bg-black overflow-hidden relative border-l border-white/5 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="h-10 bg-surface/50 border-b border-border flex items-center justify-center gap-4 text-xs font-medium text-text-muted z-20">
          <span>Live Canvas Preview (100%)</span>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-auto p-4 md:p-12 flex items-center justify-center custom-scrollbar" style={previewStyle}>
          
          {/* Simulate the background directly in the preview! */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
            {formData.backgroundAnimation === "mesh" && (
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `radial-gradient(circle at 15% 50%, var(--primary) 0%, transparent 30%), radial-gradient(circle at 85% 30%, var(--secondary) 0%, transparent 30%)` }} />
            )}
            {formData.backgroundAnimation === "waves" && (
              <div className="absolute bottom-0 left-0 w-full h-64 blur-3xl opacity-50" style={{ background: `linear-gradient(to right, transparent, var(--primary), var(--secondary), transparent)` }} />
            )}
            {formData.backgroundAnimation === "particles" && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
            )}
          </div>

          {/* Dummy Hero / Glass Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-${formData.fontFamily.toLowerCase()} relative z-10 w-full max-w-2xl bg-surface/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-2xl`}
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-50" style={{ backgroundColor: 'var(--accent)' }}></div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 border text-sm font-medium mb-6" style={{ borderRadius: 'var(--radius)', borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent)20' }}>
              LIVE THEME PREVIEW
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Design the <br/><span style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Future of UI</span>
            </h1>
            
            <p className="text-white/60 mb-8 leading-relaxed max-w-lg">
              This canvas instantly reflects your design choices. Try modifying the corner radius, colors, and background animations on the left to see the magic happen.
            </p>

            <div className="flex gap-4">
              <button 
                className="px-6 py-3 font-medium text-white flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-1"
                style={{ 
                  background: `linear-gradient(135deg, var(--primary), var(--secondary))`, 
                  borderRadius: 'var(--radius)',
                  boxShadow: `0 0 20px var(--primary)40`
                }}
              >
                Primary Button <ArrowRight size={16} />
              </button>
              <button 
                className="px-6 py-3 font-medium text-white border transition-colors hover:bg-white/5"
                style={{ 
                  borderColor: 'var(--border)', 
                  borderRadius: 'var(--radius)'
                }}
              >
                Secondary
              </button>
            </div>

            {/* Little Skill Pills */}
            <div className="mt-12 pt-8 border-t border-white/10 flex gap-3">
              {['React', 'Next.js', 'Figma'].map(skill => (
                <div key={skill} className="px-3 py-1 bg-black/40 border border-white/5 text-xs text-white/80" style={{ borderRadius: 'var(--radius)' }}>
                  {skill}
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>

    </div>
  );
}

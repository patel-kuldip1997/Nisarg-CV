"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, Palette, RotateCcw, Sparkles, Layers, Type, ArrowRight, MousePointer2, Wand2, Square, LayoutTemplate, Zap, Box, Image as ImageIcon, CircleDashed, ChevronRight, Settings, Code, ZapIcon , Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FigmaThemeCustomizer() {
  const [formData, setFormData] = useState<any>({
    // V1 & V2 Fields
    primaryColor: "#3b82f6", secondaryColor: "#8b5cf6", accentColor: "#10b981", backgroundColor: "#050505",
    fontFamily: "Inter", backgroundAnimation: "mesh", enableParallax: true, cardStyle: "glassmorphism",
    borderRadius: "8px", buttonStyle: "filled", navbarStyle: "floating", cursorStyle: "default",
    layoutWidth: "max-w-7xl", glowIntensity: "medium", textReveal: "fade", sectionSpacing: "normal",
    shadowStyle: "soft", borderWidth: "1px", backdropBlur: "md", pageTransition: "fade", imageStyle: "rounded",
    activeMasterTheme: "glass",
    // V3 Fields
    successColor: "#22c55e", warningColor: "#f59e0b", errorColor: "#ef4444", infoColor: "#3b82f6", surfaceColor: "#0a0a0a",
    headingFontWeight: "bold", bodyFontWeight: "normal", letterSpacing: "normal", lineHeight: "relaxed", textTransform: "none",
    buttonPadding: "normal", buttonHoverEffect: "lift", buttonIconPosition: "right", buttonAnimation: "pulse", buttonShadow: "none",
    navbarHeight: "normal", navbarBlurIntensity: "md", navbarHoverEffect: "glow", navbarDropdownStyle: "modern", logoSize: "normal",
    cardPadding: "normal", cardHoverLift: "medium", cardImageRatio: "video", cardBorderAccent: "none", cardGlowIntensity: "none",
    footerStyle: "modern", footerColumns: "4", contentAlignment: "left", scrollSpeedPhysics: "smooth", parallaxDepth: "medium", skillLayout: "design1"
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("themes"); // themes, colors, layout, shapes, effects

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setFormData({ ...formData, ...data });
      })
      .finally(() => setLoading(false));
  }, []);

  // LIVE PREVIEW ENGINE
  useEffect(() => {
    if (!formData) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', formData.primaryColor);
    root.style.setProperty('--secondary', formData.secondaryColor);
    root.style.setProperty('--accent', formData.accentColor);
    root.style.setProperty('--background', formData.backgroundColor);
    
    if (formData.fontFamily) {
      const fontId = 'dynamic-google-font-admin';
      let link = document.getElementById(fontId) as HTMLLinkElement;
      
      const formattedFont = formData.fontFamily.replace(/ /g, '+');
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
      
      document.body.style.setProperty('--font-primary', `"${formData.fontFamily}", sans-serif`);
      document.body.style.fontFamily = 'var(--font-primary)';
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value, activeMasterTheme: "custom" });
  };

  const handleCustomSelect = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value, activeMasterTheme: "custom" });
  };

  
  const handleReset = (tab: string) => {
    let resetData = {};
    if (tab === 'identity') {
      resetData = { logoType: "text", logoText: "KP.", logoImageUrl: "", faviconUrl: "", siteTitle: "My Portfolio" };
    }
    if (tab === 'colors') {
      resetData = { primaryColor: "#3b82f6", secondaryColor: "#8b5cf6", accentColor: "#10b981", backgroundColor: "#050505", surfaceColor: "#0a0a0a", successColor: "#22c55e", warningColor: "#f59e0b", errorColor: "#ef4444", infoColor: "#3b82f6", fontFamily: "Inter", headingFontWeight: "bold", bodyFontWeight: "normal", letterSpacing: "normal", lineHeight: "relaxed", textTransform: "none" };
    } else if (tab === 'layout') {
      resetData = { navbarStyle: "floating", navbarDropdownStyle: "modern", navbarHeight: "normal", navbarBlurIntensity: "md", layoutWidth: "max-w-7xl", sectionSpacing: "normal", footerStyle: "modern", contentAlignment: "left", footerColumns: "4", skillLayout: "design1" };
    } else if (tab === 'shapes') {
      resetData = { cardStyle: "glassmorphism", cardPadding: "normal", borderRadius: "8px", borderWidth: "1px", buttonStyle: "filled", buttonPadding: "normal", imageStyle: "rounded", buttonIconPosition: "right", buttonShadow: "none", logoSize: "normal", cardHoverLift: "medium", cardImageRatio: "video", cardBorderAccent: "none" };
    } else if (tab === 'effects') {
      resetData = { backgroundAnimation: "mesh", shadowStyle: "soft", glowIntensity: "medium", buttonHoverEffect: "lift", textReveal: "fade", pageTransition: "fade", cursorStyle: "default", enableParallax: true, buttonAnimation: "pulse", cardGlowIntensity: "none", scrollSpeedPhysics: "smooth", parallaxDepth: "medium" };
    }
    setFormData({ ...formData, ...resetData, activeMasterTheme: "custom" });
    toast.info("Restored to default.");
  };

  const applyMasterTheme = (themeName: string) => {
    let newSettings: any = { ...formData, activeMasterTheme: themeName };
    switch (themeName) {
      case 'apple':
        newSettings = { ...newSettings, primaryColor: '#ffffff', secondaryColor: '#a1a1aa', accentColor: '#3f3f46', backgroundColor: '#000000', surfaceColor: '#0a0a0a', fontFamily: 'Inter', backgroundAnimation: 'none', cardStyle: 'flat', borderRadius: '16px', buttonStyle: 'filled', shadowStyle: 'none', borderWidth: '1px', headingFontWeight: 'bold', buttonPadding: 'normal' }; break;
      case 'cyberpunk':
        newSettings = { ...newSettings, primaryColor: '#facc15', secondaryColor: '#ec4899', accentColor: '#06b6d4', backgroundColor: '#050505', surfaceColor: '#121212', fontFamily: 'JetBrains Mono', backgroundAnimation: 'grid', cardStyle: 'outline', borderRadius: '0px', buttonStyle: 'outline', shadowStyle: 'hard', borderWidth: '2px', headingFontWeight: 'black', textTransform: 'uppercase', buttonHoverEffect: 'glow' }; break;
      case 'glass':
        newSettings = { ...newSettings, primaryColor: '#3b82f6', secondaryColor: '#8b5cf6', accentColor: '#10b981', backgroundColor: '#050505', surfaceColor: '#0a0a0a', fontFamily: 'Outfit', backgroundAnimation: 'mesh', cardStyle: 'glassmorphism', borderRadius: '16px', buttonStyle: 'gradient', shadowStyle: 'colored', backdropBlur: 'heavy' }; break;
      case 'neumorph':
        newSettings = { ...newSettings, primaryColor: '#3b82f6', secondaryColor: '#8b5cf6', backgroundColor: '#121212', surfaceColor: '#121212', fontFamily: 'Roboto', backgroundAnimation: 'none', cardStyle: 'neumorphism', borderRadius: '24px', buttonStyle: 'soft', borderWidth: '0px', shadowStyle: 'soft' }; break;
      case 'space':
        newSettings = { ...newSettings, primaryColor: '#c084fc', secondaryColor: '#3b82f6', backgroundColor: '#020617', surfaceColor: '#0f172a', fontFamily: 'Inter', backgroundAnimation: 'particles', cardStyle: 'glassmorphism', borderRadius: '12px', buttonStyle: 'gradient', glowIntensity: 'high', shadowStyle: 'colored' }; break;
      case 'forest':
        newSettings = { ...newSettings, primaryColor: '#4ade80', secondaryColor: '#22c55e', backgroundColor: '#064e3b', surfaceColor: '#065f46', fontFamily: 'Outfit', backgroundAnimation: 'waves', cardStyle: 'flat', borderRadius: '24px', buttonStyle: 'soft', shadowStyle: 'soft' }; break;
      case 'dracula':
        newSettings = { ...newSettings, primaryColor: '#ff79c6', secondaryColor: '#bd93f9', backgroundColor: '#282a36', surfaceColor: '#44475a', fontFamily: 'JetBrains Mono', backgroundAnimation: 'none', cardStyle: 'outline', borderRadius: '8px', buttonStyle: 'outline', shadowStyle: 'hard' }; break;
      case 'corporate':
        newSettings = { ...newSettings, primaryColor: '#2563eb', secondaryColor: '#1e40af', backgroundColor: '#0f172a', surfaceColor: '#1e293b', fontFamily: 'Roboto', backgroundAnimation: 'none', cardStyle: 'flat', borderRadius: '4px', buttonStyle: 'filled', shadowStyle: 'soft' }; break;
      case 'retro':
        newSettings = { ...newSettings, primaryColor: '#ff00ff', secondaryColor: '#00ffff', accentColor: '#ffff00', backgroundColor: '#120024', surfaceColor: '#2a004f', fontFamily: 'Syne', backgroundAnimation: 'grid', cardStyle: 'outline', borderRadius: '0px', buttonStyle: 'filled', shadowStyle: 'hard', borderWidth: '2px', headingFontWeight: 'black', textTransform: 'uppercase', letterSpacing: 'wide' }; break;
      case 'notion':
        newSettings = { ...newSettings, primaryColor: '#000000', secondaryColor: '#333333', accentColor: '#dddddd', backgroundColor: '#ffffff', surfaceColor: '#f9f9f9', fontFamily: 'Inter', backgroundAnimation: 'none', cardStyle: 'flat', borderRadius: '4px', buttonStyle: 'outline', shadowStyle: 'none', borderWidth: '1px', headingFontWeight: 'bold', buttonPadding: 'small' }; break;
      case 'eightbit':
        newSettings = { ...newSettings, primaryColor: '#39ff14', secondaryColor: '#ff0000', backgroundColor: '#000000', surfaceColor: '#111111', fontFamily: 'JetBrains Mono', backgroundAnimation: 'grid', cardStyle: 'outline', borderRadius: '0px', buttonStyle: 'outline', shadowStyle: 'none', borderWidth: '4px', textTransform: 'uppercase' }; break;
      case 'sakura':
        newSettings = { ...newSettings, primaryColor: '#ffb7b2', secondaryColor: '#e28413', backgroundColor: '#fff0f5', surfaceColor: '#ffe4e1', fontFamily: 'Playfair Display', backgroundAnimation: 'mesh', cardStyle: 'glassmorphism', borderRadius: '24px', buttonStyle: 'soft', shadowStyle: 'soft', backdropBlur: 'md' }; break;
      case 'oceanic':
        newSettings = { ...newSettings, primaryColor: '#0077be', secondaryColor: '#00477e', backgroundColor: '#001e36', surfaceColor: '#003359', fontFamily: 'Outfit', backgroundAnimation: 'waves', cardStyle: 'glassmorphism', borderRadius: '16px', buttonStyle: 'gradient' }; break;
      case 'sunset':
        newSettings = { ...newSettings, primaryColor: '#ff7e5f', secondaryColor: '#feb47b', backgroundColor: '#2b003a', surfaceColor: '#4a0050', fontFamily: 'Inter', backgroundAnimation: 'mesh', cardStyle: 'glassmorphism', borderRadius: '12px', buttonStyle: 'gradient' }; break;
      case 'bauhaus':
        newSettings = { ...newSettings, primaryColor: '#d62828', secondaryColor: '#003049', backgroundColor: '#fdf0d5', surfaceColor: '#fdf0d5', fontFamily: 'Space Grotesk', backgroundAnimation: 'none', cardStyle: 'flat', borderRadius: '0px', buttonStyle: 'filled', shadowStyle: 'hard', borderWidth: '4px', headingFontWeight: 'black' }; break;
      case 'brutalism':
        newSettings = { ...newSettings, primaryColor: '#0000ff', secondaryColor: '#ff0000', backgroundColor: '#e5e5e5', surfaceColor: '#cccccc', fontFamily: 'Syne', backgroundAnimation: 'none', cardStyle: 'outline', borderRadius: '0px', buttonStyle: 'outline', shadowStyle: 'hard', borderWidth: '3px', headingFontWeight: 'black', textTransform: 'uppercase' }; break;
    }
    setFormData(newSettings);
    toast.info(`Applied ${themeName.toUpperCase()} Master Theme`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoImageUrl' | 'faviconUrl' = 'logoImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData((prev: any) => ({ ...prev, [field]: result.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed: " + result.error);
      }
    } catch (err) {
      toast.error("Error uploading file.");
    } finally {
      setUploading(false);
    }
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
      if (res.ok) toast.success("Theme settings saved! Refresh the frontend to see changes.");
      else toast.error("Failed to update theme.");
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading ultimate design workspace...</div>;

  const getBrightness = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    return 0.2126 * ((rgb >> 16) & 0xff) + 0.7152 * ((rgb >> 8) & 0xff) + 0.0722 * ((rgb >> 0) & 0xff);
  };
  const isLight = getBrightness(formData.backgroundColor) > 128;
  const textColor = isLight ? '#0f172a' : '#f8fafc';
  const textMuted = isLight ? '#475569' : '#94a3b8';

  const previewStyle = {
    '--primary': formData.primaryColor, '--secondary': formData.secondaryColor, '--accent': formData.accentColor,
    '--background': formData.backgroundColor, '--radius': formData.borderRadius, '--text': textColor, '--text-muted': textMuted,
    '--surface': formData.surfaceColor, '--success': formData.successColor, '--warning': formData.warningColor,
    '--error': formData.errorColor, '--info': formData.infoColor
  } as React.CSSProperties;

  const dataAttributes = {
    'data-card-style': formData.cardStyle,
    'data-button-style': formData.buttonStyle,
    'data-font-weight': formData.headingFontWeight,
    'data-body-weight': formData.bodyFontWeight,
    'data-letter-spacing': formData.letterSpacing,
    'data-line-height': formData.lineHeight,
    'data-text-transform': formData.textTransform,
    'data-btn-padding': formData.buttonPadding,
    'data-btn-hover': formData.buttonHoverEffect,
    'data-btn-icon': formData.buttonIconPosition,
    'data-btn-anim': formData.buttonAnimation,
    'data-btn-shadow': formData.buttonShadow,
    'data-nav-height': formData.navbarHeight,
    'data-nav-blur': formData.navbarBlurIntensity,
    'data-nav-hover': formData.navbarHoverEffect,
    'data-nav-dropdown': formData.navbarDropdownStyle,
    'data-logo-size': formData.logoSize,
    'data-card-padding': formData.cardPadding,
    'data-card-lift': formData.cardHoverLift,
    'data-card-ratio': formData.cardImageRatio,
    'data-card-border-accent': formData.cardBorderAccent,
    'data-card-glow': formData.cardGlowIntensity,
    'data-footer-style': formData.footerStyle,
    'data-footer-cols': formData.footerColumns,
    'data-content-align': formData.contentAlignment,
    'data-shadow-style': formData.shadowStyle,
    'data-border-width': formData.borderWidth,
    'data-backdrop-blur': formData.backdropBlur,
    'data-page-transition': formData.pageTransition,
    'data-image-style': formData.imageStyle,
    'data-cursor-style': formData.cursorStyle,
    'data-layout-width': formData.layoutWidth,
    'data-glow-intensity': formData.glowIntensity,
    'data-text-reveal': formData.textReveal,
    'data-section-spacing': formData.sectionSpacing,
  };

  const renderRadioGrid = (title: string, prop: string, options: {id: string, label: string}[]) => (
    <div>
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">{title}</span>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map(opt => (
          <button key={opt.id} onClick={() => handleCustomSelect(prop, opt.id)} className={`py-1.5 px-1 text-[10px] font-medium rounded border transition-all ${
            (formData as any)[prop] === opt.id ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-elevated border-border text-text-muted hover:border-white/20'
          }`}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row gap-6 -m-4 md:-m-8">
      
      {/* LEFT PANE: 50+ FEATURE CONTROLS */}
      <div className="w-full md:w-[450px] shrink-0 bg-surface border-r border-border h-full flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-elevated/50">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-primary" />
            <h1 className="font-bold text-white text-sm">V3 Ultimate Engine</h1>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-2 rounded transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2">
            <Save size={14} /> {saving ? "Publishing..." : "Publish Site"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto custom-scrollbar border-b border-border bg-surface-elevated">
          {[
            { id: 'identity', label: 'Site Identity', icon: Fingerprint },
            { id: 'themes', label: 'Themes', icon: Wand2 },
            { id: 'colors', label: 'Colors & Text', icon: Palette },
            { id: 'layout', label: 'Layout', icon: LayoutTemplate },
            { id: 'shapes', label: 'Shapes', icon: Square },
            { id: 'effects', label: 'Motion', icon: Sparkles }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-muted hover:text-white'}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Control Area */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-20">
          
          
          {/* TAB 0: SITE IDENTITY */}
          {activeTab === 'identity' && (
            <section className="space-y-6">
              <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                <h2 className="text-xs font-bold text-white">Site Identity & Branding</h2>
                <button onClick={() => handleReset('identity')} className="text-[10px] flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                  <RotateCcw size={12} /> Reset Identity
                </button>
              </div>

              {/* Site Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted block">Browser Tab Name (Site Title)</label>
                <input 
                  type="text" 
                  value={formData.siteTitle || ""} 
                  onChange={e => setFormData({ ...formData, siteTitle: e.target.value })}
                  className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Logo Type */}
              {renderRadioGrid("Logo Type", "logoType", [{id:'text',label:'Text Logo'},{id:'image',label:'Image Logo'}])}

              {/* Logo Text / Image */}
              {formData.logoType === 'text' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-muted block">Logo Text</label>
                  <input 
                    type="text" 
                    value={formData.logoText || ""} 
                    onChange={e => setFormData({ ...formData, logoText: e.target.value })}
                    className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-[10px] text-text-muted mt-1">First letter will be highlighted in primary color.</p>
                </div>
              ) : (
                                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-muted block">Logo Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.logoImageUrl || ""} 
                      onChange={e => setFormData({ ...formData, logoImageUrl: e.target.value })}
                      className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                      placeholder="https://your-image-url.svg"
                    />
                    <label className="cursor-pointer bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap">
                      {uploading ? "Uploading..." : "Upload Logo"}
                      <input type="file" className="hidden" accept="image/*,.svg" onChange={e => handleFileUpload(e, 'logoImageUrl')} disabled={uploading} />
                    </label>
                  </div>
                  {formData.logoImageUrl && (
                    <div className="mt-2 p-4 bg-surface border border-border rounded flex justify-center">
                      <img src={formData.logoImageUrl} alt="Logo Preview" className="h-10 object-contain" />
                    </div>
                  )}
                </div>
              )}

                <div className="space-y-2 mt-4 pt-4 border-t border-border">
                  <label className="text-sm font-bold text-white block">Site Favicon (Browser Tab Icon)</label>
                  <p className="text-xs text-text-muted mb-2">Upload a small square image (.png or .ico) for your website tab.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.faviconUrl || ""} 
                      onChange={e => setFormData({ ...formData, faviconUrl: e.target.value })}
                      className="flex-1 bg-surface border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                      placeholder="https://your-favicon.png"
                    />
                    <label className="cursor-pointer bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap">
                      {uploading ? "Uploading..." : "Upload Favicon"}
                      <input type="file" className="hidden" accept=".png,.ico,.jpg,.svg" onChange={e => handleFileUpload(e, 'faviconUrl')} disabled={uploading} />
                    </label>
                  </div>
                  {formData.faviconUrl && (
                    <div className="mt-2 p-2 w-12 h-12 bg-surface border border-border rounded flex justify-center items-center">
                      <img src={formData.faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>

            </section>
          )}


          {/* TAB 1: THEMES */}
          {activeTab === 'themes' && (
            <section>
              <h2 className="text-xs font-bold text-white mb-4">1-Click Pro Themes (16)</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'apple', label: '🍎 Apple Pro' }, { id: 'cyberpunk', label: '⚡ Cyberpunk' },
                  { id: 'glass', label: '🔮 Glassmorphism' }, { id: 'neumorph', label: '🔲 Neumorphic' },
                  { id: 'space', label: '🌌 Deep Space' }, { id: 'forest', label: '🍃 Forest' },
                  { id: 'dracula', label: '🩸 Dracula' }, { id: 'corporate', label: '💼 Corporate' },
                  { id: 'retro', label: '📼 Retro Pop' }, { id: 'notion', label: '📝 Notion Minimal' },
                  { id: 'eightbit', label: '🕹️ 8-Bit Arcade' }, { id: 'sakura', label: '🌸 Sakura Light' },
                  { id: 'oceanic', label: '🌊 Oceanic Fluid' }, { id: 'sunset', label: '🌅 Sunset Glow' },
                  { id: 'bauhaus', label: '📐 Bauhaus Art' }, { id: 'brutalism', label: '🏗️ Brutalism' }
                ].map(theme => (
                  <button key={theme.id} onClick={() => applyMasterTheme(theme.id)} className={`text-xs py-3 rounded border font-semibold transition-all relative ${formData.activeMasterTheme === theme.id ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.02]' : 'bg-surface-elevated border-border text-text-muted hover:border-white/20 hover:text-white'}`}>
                    {theme.label}
                    {formData.activeMasterTheme === theme.id && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* TAB 2: COLORS & TYPOGRAPHY */}
          {activeTab === 'colors' && (
            <section className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
    <h2 className="text-xs font-bold text-white">Core Colors (10)</h2>
    <button onClick={() => handleReset('colors')} className="text-[10px] flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
      <RotateCcw size={12} /> Reset
    </button>
  </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'primaryColor', label: 'Primary' }, { id: 'secondaryColor', label: 'Secondary' },
                    { id: 'accentColor', label: 'Accent/Glow' }, { id: 'backgroundColor', label: 'Background' },
                    { id: 'surfaceColor', label: 'Card Surface' }, { id: 'successColor', label: 'Success' },
                    { id: 'warningColor', label: 'Warning' }, { id: 'errorColor', label: 'Error' },
                    { id: 'infoColor', label: 'Info' }
                  ].map((color) => (
                    <div key={color.id} className="flex flex-col bg-surface-elevated p-2 rounded border border-border">
                      <span className="text-[10px] text-white/60 mb-1">{color.label}</span>
                      <div className="flex items-center gap-2">
                        <input type="color" name={color.id} value={(formData as any)[color.id]} onChange={handleChange} className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" name={color.id} value={(formData as any)[color.id].toUpperCase()} onChange={handleChange} className="w-full bg-transparent text-xs text-white uppercase focus:outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-white mb-4 border-b border-border pb-2">Advanced Typography</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-white/60 mb-1 block">Font Family</span>
                    <select name="fontFamily" value={formData.fontFamily} onChange={handleChange} className="w-full bg-surface-elevated border border-border px-2 py-1.5 text-xs text-white rounded">
                      <option value="Inter">Inter (Clean)</option><option value="Outfit">Outfit (Bold)</option>
                      <option value="Roboto">Roboto (Classic)</option><option value="JetBrains Mono">JetBrains (Tech)</option>
                      <option value="Space Grotesk">Space Grotesk</option><option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option><option value="Syne">Syne (Brutalist)</option>
                      <option value="Playfair Display">Playfair (Luxury)</option>
                    </select>
                  </div>
                  {renderRadioGrid("Heading Weight", "headingFontWeight", [{id:'normal',label:'Normal'},{id:'medium',label:'Medium'},{id:'bold',label:'Bold'},{id:'black',label:'Black'}])}
                  {renderRadioGrid("Body Weight", "bodyFontWeight", [{id:'light',label:'Light'},{id:'normal',label:'Normal'},{id:'medium',label:'Medium'}])}
                  {renderRadioGrid("Letter Spacing", "letterSpacing", [{id:'tight',label:'Tight'},{id:'normal',label:'Normal'},{id:'wide',label:'Wide'},{id:'widest',label:'Widest'}])}
                  {renderRadioGrid("Line Height", "lineHeight", [{id:'tight',label:'Tight'},{id:'relaxed',label:'Relaxed'},{id:'loose',label:'Loose'}])}
                  {renderRadioGrid("Text Transform", "textTransform", [{id:'none',label:'Normal'},{id:'uppercase',label:'UPPERCASE'},{id:'lowercase',label:'lowercase'}])}
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: LAYOUT */}
          {activeTab === 'layout' && (
            <section className="space-y-6">
              <div className="flex justify-end -mb-2">
                <button onClick={() => handleReset('layout')} className="text-[10px] flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                  <RotateCcw size={12} /> Reset Layout
                </button>
              </div>
              {renderRadioGrid("Navbar Style", "navbarStyle", [{id:'floating',label:'Floating'},{id:'sticky',label:'Sticky'},{id:'minimal',label:'Minimal'}])}
              {renderRadioGrid("Navbar Dropdown", "navbarDropdownStyle", [{id:'modern',label:'Modern'},{id:'fullscreen',label:'Full'},{id:'sidebar',label:'Sidebar'}])}
              {renderRadioGrid("Navbar Height", "navbarHeight", [{id:'compact',label:'Compact'},{id:'normal',label:'Normal'},{id:'tall',label:'Tall'}])}
              {renderRadioGrid("Navbar Blur", "navbarBlurIntensity", [{id:'none',label:'None'},{id:'md',label:'Medium'},{id:'heavy',label:'Heavy'}])}
              {renderRadioGrid("Container Width", "layoutWidth", [{id:'max-w-5xl',label:'Compact'},{id:'max-w-7xl',label:'Standard'},{id:'max-w-screen-2xl',label:'Wide'},{id:'w-full px-4',label:'Fluid'}])}
              {renderRadioGrid("Section Spacing", "sectionSpacing", [{id:'compact',label:'Compact'},{id:'normal',label:'Normal'},{id:'relaxed',label:'Relaxed'},{id:'awwwards',label:'Huge'}])}
              {renderRadioGrid("Footer Style", "footerStyle", [{id:'minimal',label:'Minimal'},{id:'modern',label:'Modern'},{id:'large',label:'Large'}])}
              {renderRadioGrid("Content Align", "contentAlignment", [{id:'left',label:'Left'},{id:'center',label:'Center'}])}

              <div className="pt-4 border-t border-border mt-6">
                <h3 className="text-sm font-bold text-white mb-4">Skill Section Design</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.skillLayout === 'design1' ? 'border-primary bg-primary/10' : 'border-border bg-surface-elevated hover:border-white/30'}`}
                    onClick={() => handleCustomSelect('skillLayout', 'design1')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-white">Design 1 (Grid Cards)</h4>
                      {formData.skillLayout === 'design1' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-text-muted">Glassmorphic category cards with linear skill lists.</p>
                  </div>
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.skillLayout === 'design2' ? 'border-primary bg-primary/10' : 'border-border bg-surface-elevated hover:border-white/30'}`}
                    onClick={() => handleCustomSelect('skillLayout', 'design2')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-white">Design 2 (Grouped Pills)</h4>
                      {formData.skillLayout === 'design2' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-text-muted">Categorized boxes with SVG icons and pill-shaped skills.</p>
                  </div>
                </div>
              </div>

            </section>
          )}

          {/* TAB 4: SHAPES */}
          {activeTab === 'shapes' && (
            <section className="space-y-6">
              <div className="flex justify-end -mb-2">
                <button onClick={() => handleReset('shapes')} className="text-[10px] flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                  <RotateCcw size={12} /> Reset Shapes
                </button>
              </div>
              {renderRadioGrid("Card Architecture", "cardStyle", [{id:'glassmorphism',label:'Glass'},{id:'flat',label:'Flat'},{id:'outline',label:'Outline'},{id:'neumorphism',label:'Neumorph'}])}
              {renderRadioGrid("Card Padding", "cardPadding", [{id:'compact',label:'Compact'},{id:'normal',label:'Normal'},{id:'spacious',label:'Spacious'}])}
              {renderRadioGrid("Global Border Radius", "borderRadius", [{id:'0px',label:'Sharp'},{id:'8px',label:'Medium'},{id:'16px',label:'Large'},{id:'999px',label:'Pill'}])}
              {renderRadioGrid("Border Width", "borderWidth", [{id:'0px',label:'None'},{id:'1px',label:'Thin'},{id:'2px',label:'Thick'},{id:'4px',label:'Heavy'}])}
              {renderRadioGrid("Button Style", "buttonStyle", [{id:'filled',label:'Solid'},{id:'gradient',label:'Shiny'},{id:'outline',label:'Ghost'},{id:'soft',label:'Tinted'}])}
              {renderRadioGrid("Button Padding", "buttonPadding", [{id:'small',label:'Small'},{id:'normal',label:'Normal'},{id:'large',label:'Large'}])}
              {renderRadioGrid("Image Style", "imageStyle", [{id:'rounded',label:'Rounded'},{id:'sharp',label:'Sharp'},{id:'monochrome',label:'B&W'},{id:'polaroid',label:'Polaroid'}])}
            </section>
          )}

          {/* TAB 5: EFFECTS */}
          {activeTab === 'effects' && (
            <section className="space-y-6">
              <div className="flex justify-end -mb-2">
                <button onClick={() => handleReset('effects')} className="text-[10px] flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                  <RotateCcw size={12} /> Reset Effects
                </button>
              </div>
              {renderRadioGrid("Background Physics", "backgroundAnimation", [{id:'none',label:'Solid'},{id:'mesh',label:'Mesh'},{id:'waves',label:'Waves'},{id:'particles',label:'Particles'},{id:'grid',label:'Matrix'}])}
              {renderRadioGrid("Shadow Intensity", "shadowStyle", [{id:'none',label:'Flat'},{id:'soft',label:'Soft'},{id:'hard',label:'Brutalist'},{id:'colored',label:'Colored Glow'}])}
              {renderRadioGrid("Glow Intensity", "glowIntensity", [{id:'none',label:'None'},{id:'low',label:'Low'},{id:'medium',label:'Medium'},{id:'high',label:'High'}])}
              {renderRadioGrid("Button Hover", "buttonHoverEffect", [{id:'lift',label:'Lift'},{id:'scale',label:'Scale'},{id:'glow',label:'Glow'},{id:'none',label:'None'}])}
              {renderRadioGrid("Text Reveal", "textReveal", [{id:'fade',label:'Fade'},{id:'slide',label:'Slide'},{id:'typewriter',label:'Type'}])}
              {renderRadioGrid("Page Transition", "pageTransition", [{id:'fade',label:'Fade'},{id:'slide',label:'Slide'},{id:'scale',label:'Scale'},{id:'none',label:'Instant'}])}
              
              <div className="flex items-center justify-between bg-surface-elevated p-3 rounded border border-border mt-4">
                <span className="text-[11px] font-bold text-white flex items-center gap-2">Magic Cursor</span>
                <input type="checkbox" checked={formData.cursorStyle === 'magic'} onChange={(e) => handleCustomSelect('cursorStyle', e.target.checked ? 'magic' : 'default')} className="accent-primary w-4 h-4" />
              </div>
              <div className="flex items-center justify-between bg-surface-elevated p-3 rounded border border-border">
                <span className="text-[11px] font-bold text-white flex items-center gap-2">3D Parallax Engine</span>
                <input type="checkbox" name="enableParallax" checked={formData.enableParallax} onChange={handleChange} className="accent-primary w-4 h-4" />
              </div>
            </section>
          )}

        </div>
      </div>

      {/* RIGHT PANE: CONTEXT-AWARE LIVE PREVIEW CANVAS */}
      <div className="flex-1 bg-black overflow-hidden relative border-l border-white/5 flex flex-col">
        <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-4">
          <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Context-Aware Live Preview</span>
          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-sm text-[10px] font-bold uppercase">{activeTab} VIEW</span>
        </div>

        <div className="flex-1 relative overflow-auto p-4 md:p-8 flex items-center justify-center custom-scrollbar" 
          style={previewStyle} 
          {...dataAttributes}
        >
          
          {/* Background Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
            {formData.backgroundAnimation === "mesh" && (
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `radial-gradient(circle at 15% 50%, var(--primary) 0%, transparent 30%), radial-gradient(circle at 85% 30%, var(--secondary) 0%, transparent 30%)` }} />
            )}
            {formData.backgroundAnimation === "waves" && (
              <div className="absolute bottom-0 left-0 w-full h-64 blur-3xl opacity-50" style={{ background: `linear-gradient(to right, transparent, var(--primary), var(--secondary), transparent)` }} />
            )}
            {formData.backgroundAnimation === "particles" && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse" />
            )}
            {formData.backgroundAnimation === "grid" && (
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)`, backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
            )}
          </div>

          {/* DYNAMIC CANVAS CONTENT BASED ON TAB */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`font-${formData.fontFamily.toLowerCase().replace(' ', '-')} relative z-10 w-full max-w-3xl`}
            >
              
              {/* THEMES PREVIEW */}
              {activeTab === 'themes' && (
                <div className="glass-card p-10 md:p-14" style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                  <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-50 transition-colors duration-500" style={{ backgroundColor: formData.glowIntensity !== 'none' ? 'var(--accent)' : 'transparent' }}></div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-bold tracking-widest mb-6 uppercase" style={{ borderRadius: 'var(--radius)', borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}>
                    Master Theme
                  </div>
                  <h1 className="text-5xl md:text-6xl text-[var(--text)] mb-4">
                    The <span style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Ultimate</span> Engine
                  </h1>
                  <p className="text-[var(--text-muted)] mb-8 max-w-lg text-lg">Experience the full power of V3. Switch tabs on the left to see context-aware components instantly adapt to your design choices.</p>
                  <div className="flex gap-4">
                    <button className="btn-primary" style={{ borderRadius: 'var(--radius)' }}>Primary Action <ArrowRight size={16} className="ml-2" /></button>
                    <button className="btn-outline text-[var(--text)]" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>Secondary</button>
                  </div>
                </div>
              )}

              {/* COLORS & TEXT PREVIEW */}
              {activeTab === 'colors' && (
                <div className="space-y-8">
                  {/* Swatches */}
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { c: 'var(--primary)', n: 'Primary' }, { c: 'var(--secondary)', n: 'Secondary' },
                      { c: 'var(--accent)', n: 'Accent' }, { c: 'var(--success)', n: 'Success' }, { c: 'var(--surface)', n: 'Surface' }
                    ].map(swatch => (
                      <div key={swatch.n} className="flex flex-col gap-2">
                        <div className="w-16 h-16 rounded-full border border-[var(--border)] shadow-lg" style={{ backgroundColor: swatch.c }}></div>
                        <span className="text-[10px] text-center font-bold text-[var(--text-muted)] uppercase">{swatch.n}</span>
                      </div>
                    ))}
                  </div>
                  {/* Typography */}
                  <div className="glass-card p-8" style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                    <p className="text-[var(--accent)] font-bold text-sm mb-4">Typography Specimen</p>
                    <h1 className="text-4xl text-[var(--text)] mb-2">Heading One (H1)</h1>
                    <h2 className="text-2xl text-[var(--text)] mb-4">Heading Two (H2)</h2>
                    <p className="text-[var(--text-muted)] text-lg">
                      This paragraph demonstrates the body font weight, letter spacing, and line height settings. Notice how the readability changes based on your 'Advanced Typography' choices in the left panel.
                    </p>
                  </div>
                </div>
              )}

              {/* LAYOUT PREVIEW */}
              {activeTab === 'layout' && (
                <div className="border border-[var(--border)] bg-[var(--background)] shadow-2xl flex flex-col h-[500px]" style={{ borderRadius: 'var(--radius)' }}>
                  {/* Mock Navbar */}
                  <div className={`p-4 border-b border-[var(--border)] flex justify-between items-center ${formData.navbarStyle === 'floating' ? 'm-4 rounded-full bg-[var(--surface)] shadow-lg' : 'bg-[var(--surface)]'}`} style={{ backdropFilter: formData.navbarBlurIntensity !== 'none' ? 'blur(16px)' : 'none' }}>
                    <span className="font-black text-[var(--text)]">KP.</span>
                    <div className="flex gap-4"><div className="w-8 h-2 bg-[var(--text-muted)] rounded-full"></div><div className="w-12 h-2 bg-[var(--text-muted)] rounded-full"></div></div>
                  </div>
                  {/* Mock Body */}
                  <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className={`w-full ${formData.layoutWidth === 'max-w-5xl' ? 'max-w-md' : formData.layoutWidth === 'w-full px-4' ? 'max-w-full' : 'max-w-xl'}`}>
                      <div className="h-4 w-3/4 bg-[var(--primary)] mx-auto rounded-full mb-4"></div>
                      <div className="h-2 w-full bg-[var(--text-muted)] mx-auto rounded-full mb-2 opacity-30"></div>
                      <div className="h-2 w-5/6 bg-[var(--text-muted)] mx-auto rounded-full mb-2 opacity-30"></div>
                      <div className="h-2 w-4/6 bg-[var(--text-muted)] mx-auto rounded-full opacity-30"></div>
                    </div>
                  </div>
                  {/* Mock Footer */}
                  <div className={`p-6 border-t border-[var(--border)] bg-[var(--surface)] grid gap-4 ${formData.footerColumns === '4' ? 'grid-cols-4' : formData.footerColumns === '3' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <div className="h-2 w-full bg-[var(--text-muted)] rounded-full opacity-40"></div>
                    <div className="h-2 w-full bg-[var(--text-muted)] rounded-full opacity-40"></div>
                    <div className="h-2 w-full bg-[var(--text-muted)] rounded-full opacity-40"></div>
                  </div>
                </div>
              )}

              {/* SHAPES PREVIEW */}
              {activeTab === 'shapes' && (
                <div className="grid gap-6">
                  <div className="glass-card p-6 flex justify-between items-center" style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[var(--text)] font-bold text-lg">Card Style: {formData.cardStyle}</span>
                      <span className="text-[var(--text-muted)] text-sm">Radius: {formData.borderRadius} | Border: {formData.borderWidth}</span>
                    </div>
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: 'var(--primary)', borderRadius: 'var(--radius)' }}></div>
                  </div>
                  
                  <div className="glass-card p-8 flex flex-col items-center justify-center gap-6" style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                    <h3 className="text-[var(--text)] font-bold">Button Architecture</h3>
                    <div className="flex gap-4">
                      <button className="btn-primary" style={{ borderRadius: 'var(--radius)' }}>Solid Primary</button>
                      <button className="btn-outline text-[var(--text)]" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>Ghost Outline</button>
                    </div>
                  </div>
                </div>
              )}

              {/* EFFECTS PREVIEW */}
              {activeTab === 'effects' && (
                <div className="glass-card p-12 text-center relative overflow-hidden group" style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  
                  <ZapIcon size={48} className="mx-auto text-[var(--accent)] mb-6 animate-bounce" />
                  <h2 className="text-3xl text-[var(--text)] mb-4">Hover to see magic</h2>
                  <p className="text-[var(--text-muted)] mb-8">
                    Watch how the glow intensity, background physics, and shadows react when you interact with this element.
                  </p>
                  <button className="btn-primary transform group-hover:scale-110 transition-all duration-300" style={{ borderRadius: 'var(--radius)', boxShadow: formData.shadowStyle === 'colored' ? '0 10px 30px var(--primary)' : 'none' }}>
                    Interactive Element
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

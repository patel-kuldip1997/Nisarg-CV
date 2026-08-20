"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, Plus, ArrowUp, ArrowDown, GripVertical, Trash2, Edit3, LayoutTemplate } from "lucide-react";

export default function PageBuilderAdmin() {
  const [themeSettings, setThemeSettings] = useState<any>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Section Builder Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [themeRes, sectionsRes] = await Promise.all([
        fetch('/api/theme'),
        fetch('/api/custom-section')
      ]);
      const themeData = await themeRes.json();
      const sectionsData = await sectionsRes.json();
      
      setThemeSettings(themeData);
      setSectionOrder(themeData.sectionOrder ? themeData.sectionOrder.split(',') : ['hero','about','experience','skills','projects','education','contact']);
      setCustomSections(sectionsData);
    } catch (e) {
      toast.error("Failed to load page builder data");
    } finally {
      setLoading(false);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sectionOrder.length - 1) return;
    
    const newOrder = [...sectionOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const removeSection = (sectionId: string) => {
    setSectionOrder(sectionOrder.filter(s => s !== sectionId));
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...themeSettings, sectionOrder: sectionOrder.join(',') })
      });
      toast.success("Page layout saved!");
    } catch(e) {
      toast.error("Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  const availableDefaultSections = ['hero','about','experience','skills','projects','education','contact']
    .filter(s => !sectionOrder.includes(s));

  const addSectionToLayout = (sectionId: string) => {
    if (!sectionOrder.includes(sectionId)) {
      setSectionOrder([...sectionOrder, sectionId]);
    }
  };

  const handleSaveCustomSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSection.id ? 'PUT' : 'POST';
      const res = await fetch('/api/custom-section', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSection)
      });
      const saved = await res.json();
      
      if (!editingSection.id) {
        setCustomSections([...customSections, saved]);
        setSectionOrder([...sectionOrder, saved.sectionId]);
      } else {
        setCustomSections(customSections.map(s => s.id === saved.id ? saved : s));
      }
      setIsModalOpen(false);
      toast.success("Custom section saved!");
    } catch(e) {
      toast.error("Failed to save section");
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted animate-pulse">Loading Builder Engine...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <LayoutTemplate size={28} className="text-primary" />
            Page Builder Engine
          </h1>
          <p className="text-text-muted">Reorder sections and build custom layouts Elementor-style.</p>
        </div>
        <button onClick={handleSaveOrder} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} /> {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border border-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GripVertical size={20} className="text-text-muted" /> Active Page Layout
            </h2>
            <p className="text-sm text-text-muted mb-6">Drag and drop or use arrows to rearrange the order of sections on your homepage.</p>
            
            <div className="space-y-3">
              {sectionOrder.map((sectionId, index) => {
                const isCustom = sectionId.startsWith('custom-');
                const customData = customSections.find(s => s.sectionId === sectionId);
                const title = isCustom ? (customData?.title || sectionId) : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                
                return (
                  <div key={sectionId} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-text-muted hover:text-white disabled:opacity-30"><ArrowUp size={16} /></button>
                        <button onClick={() => moveSection(index, 'down')} disabled={index === sectionOrder.length - 1} className="text-text-muted hover:text-white disabled:opacity-30"><ArrowDown size={16} /></button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <span className="text-xs text-text-muted bg-background px-2 py-1 rounded-full uppercase tracking-wider">{isCustom ? 'Custom Block' : 'System Default'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isCustom && (
                        <button 
                          onClick={() => { setEditingSection(customData); setIsModalOpen(true); }}
                          className="p-2 text-text-muted hover:text-primary transition-colors bg-background rounded-lg"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => removeSection(sectionId)}
                        className="p-2 text-text-muted hover:text-error transition-colors bg-background rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border border-border">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Section</h2>
            
            <button 
              onClick={() => {
                setEditingSection({
                  sectionId: `custom-${Date.now()}`,
                  title: 'New Section',
                  subtitle: '',
                  layout: 'full-text',
                  content: '{"blocks": [{"type": "paragraph", "value": "Enter your text here"}]}',
                  isVisible: true
                });
                setIsModalOpen(true);
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 mb-6"
            >
              <Plus size={18} /> Build Custom Section
            </button>
            
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Unused System Sections</h3>
              {availableDefaultSections.length === 0 ? (
                <p className="text-sm text-text-muted/60">All system sections are currently active on the page.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {availableDefaultSections.map(section => (
                    <button 
                      key={section}
                      onClick={() => addSectionToLayout(section)}
                      className="text-left px-4 py-3 bg-surface border border-border rounded-lg text-sm hover:border-primary/50 transition-colors flex justify-between items-center group"
                    >
                      <span className="capitalize">{section}</span>
                      <Plus size={14} className="text-text-muted group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Unused Custom Sections</h3>
              <div className="flex flex-col gap-2">
                {customSections.filter(s => !sectionOrder.includes(s.sectionId)).map(section => (
                  <button 
                    key={section.sectionId}
                    onClick={() => addSectionToLayout(section.sectionId)}
                    className="text-left px-4 py-3 bg-surface border border-border rounded-lg text-sm hover:border-primary/50 transition-colors flex justify-between items-center group"
                  >
                    <span>{section.title}</span>
                    <Plus size={14} className="text-text-muted group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface border border-border rounded-2xl flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutTemplate size={24} className="text-primary"/> Section Block Editor</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="section-form" onSubmit={handleSaveCustomSection} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-text-muted block mb-2">Section Title</label>
                    <input 
                      type="text" 
                      value={editingSection.title}
                      onChange={e => setEditingSection({...editingSection, title: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted block mb-2">Subtitle (Optional)</label>
                    <input 
                      type="text" 
                      value={editingSection.subtitle || ''}
                      onChange={e => setEditingSection({...editingSection, subtitle: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">Layout Structure</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['full-text', 'split-view', 'grid'].map(layout => (
                      <div 
                        key={layout}
                        onClick={() => setEditingSection({...editingSection, layout})}
                        className={`cursor-pointer border-2 rounded-xl p-4 text-center ${editingSection.layout === layout ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-text-muted'}`}
                      >
                        <span className="capitalize block font-semibold text-white">{layout.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-muted block mb-2">Raw JSON Blocks (Elementor Data Structure)</label>
                  <p className="text-xs text-text-muted mb-2">To build easily, use standard JSON block formats: {"{ \"blocks\": [ { \"type\": \"paragraph\", \"value\": \"Hello\" }, { \"type\": \"image\", \"url\": \"...\" } ] }"}</p>
                  <textarea 
                    value={editingSection.content}
                    onChange={e => setEditingSection({...editingSection, content: e.target.value})}
                    rows={12}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary font-mono text-sm" 
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-4 bg-background/50 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" form="section-form" className="btn-primary">
                Save Design Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

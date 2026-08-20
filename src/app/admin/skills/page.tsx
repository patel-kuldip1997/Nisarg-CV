"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash, Edit2, Plus, FolderTree } from "lucide-react";

export default function AdminSkills() {
  const [activeTab, setActiveTab] = useState<'skills' | 'categories'>('skills');

  // --- Skills State ---
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState({ name: "", level: 80, categoryId: 1, technologies: "", icon: "" });
  const [uploadingIcon, setUploadingIcon] = useState(false);

  // --- Categories State ---
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [currentCatId, setCurrentCatId] = useState<number | null>(null);
  const [catForm, setCatForm] = useState({ name: "", order: 0 });

  useEffect(() => { 
    fetchCategories();
    fetchSkills(); 
  }, []);

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const json = await res.json();
    setSkills(json);
    setLoadingSkills(false);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/skill-categories");
    const json = await res.json();
    setCategories(json);
    if (json.length > 0 && skillForm.categoryId === 1) {
      setSkillForm(prev => ({ ...prev, categoryId: json[0].id }));
    }
    setLoadingCategories(false);
  };

  // --- Icon Upload ---
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingIcon(true);
    const data = new FormData();
    data.append("file", file);
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (res.ok) {
        const json = await res.json();
        setSkillForm({ ...skillForm, icon: json.url });
        toast.success("Icon uploaded successfully");
      } else {
        toast.error("Failed to upload icon");
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploadingIcon(false);
    }
  };

  // --- Skills CRUD ---
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditingSkill ? `/api/skills/${currentSkillId}` : "/api/skills";
    const method = isEditingSkill ? "PUT" : "POST";
    const payload = { ...skillForm, level: parseInt(skillForm.level as any), categoryId: parseInt(skillForm.categoryId as any) };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(`Skill ${isEditingSkill ? "updated" : "added"}`);
      fetchSkills();
      resetSkillForm();
    } else toast.error("Error saving skill");
  };

  const handleSkillDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  const handleSkillEdit = (item: any) => {
    setIsEditingSkill(true);
    setCurrentSkillId(item.id);
    setSkillForm({ name: item.name, level: item.level, categoryId: item.categoryId, technologies: item.technologies || "", icon: item.icon || "" });
  };

  const resetSkillForm = () => {
    setIsEditingSkill(false); setCurrentSkillId(null);
    setSkillForm({ name: "", level: 80, categoryId: categories.length > 0 ? categories[0].id : 1, technologies: "", icon: "" });
  };

  // --- Categories CRUD ---
  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditingCat ? `/api/skill-categories/${currentCatId}` : "/api/skill-categories";
    const method = isEditingCat ? "PUT" : "POST";
    const payload = { ...catForm, order: parseInt(catForm.order as any) };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(`Category ${isEditingCat ? "updated" : "added"}`);
      fetchCategories();
      resetCatForm();
    } else toast.error("Error saving category");
  };

  const handleCatDelete = async (id: number) => {
    if (!confirm("Are you sure? This might break skills associated with this category!")) return;
    await fetch(`/api/skill-categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleCatEdit = (item: any) => {
    setIsEditingCat(true);
    setCurrentCatId(item.id);
    setCatForm({ name: item.name, order: item.order });
  };

  const resetCatForm = () => {
    setIsEditingCat(false); setCurrentCatId(null);
    setCatForm({ name: "", order: 0 });
  };

  if (loadingSkills || loadingCategories) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Skills</h1>
          <p className="text-text-muted mt-1">Add and organize your technical expertise.</p>
        </div>
        <div className="flex bg-surface-elevated rounded-lg p-1 border border-border">
          <button 
            onClick={() => setActiveTab('skills')} 
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'skills' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-white'}`}
          >
            Skills
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'categories' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-white'}`}
          >
            <FolderTree size={16}/> Categories
          </button>
        </div>
      </div>

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card p-6 h-fit border border-border">
            <h2 className="text-xl font-bold mb-4">{isEditingSkill ? "Edit Skill" : "Add Skill"}</h2>
            <form onSubmit={handleSkillSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-text-muted">Custom SVG/Icon</label>
                <div className="flex items-center gap-3">
                  {skillForm.icon && (
                    <div className="w-10 h-10 bg-surface rounded flex items-center justify-center border border-border p-1">
                      <img src={skillForm.icon} alt="Icon" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept=".svg,.png,.jpg,.jpeg" 
                    onChange={handleIconUpload} 
                    disabled={uploadingIcon}
                    className="w-full bg-surface border border-border rounded p-2 text-sm text-text-muted file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
              </div>
              <input type="text" placeholder="Skill Name" className="w-full bg-surface border border-border rounded p-3 text-white" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} required />
              
              <div className="space-y-1">
                <select 
                  className="w-full bg-surface border border-border rounded p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none" 
                  value={skillForm.categoryId} 
                  onChange={e => setSkillForm({...skillForm, categoryId: parseInt(e.target.value)})} 
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && <option value={1}>Please add a category first</option>}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-text-muted">Proficiency: {skillForm.level}%</label>
                <input type="range" min="0" max="100" className="w-full" value={skillForm.level} onChange={e => setSkillForm({...skillForm, level: parseInt(e.target.value)})} />
              </div>
              
              <div className="flex gap-4">
                <button type="submit" className="btn-primary w-full">{isEditingSkill ? "Update" : "Add"}</button>
                {isEditingSkill && <button type="button" onClick={resetSkillForm} className="btn-outline w-full">Cancel</button>}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(item => (
                <div key={item.id} className="glass-card p-6 flex justify-between items-center border border-border group hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.icon ? (
                        <div className="w-6 h-6 p-0.5 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                          <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                      ) : null}
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{item.category?.name || 'Unknown Category'}</p>
                    <div className="w-full bg-surface rounded-full h-1.5 mt-3 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${item.level}%` }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleSkillEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded"><Edit2 size={16}/></button>
                    <button onClick={() => handleSkillDelete(item.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card p-6 h-fit border border-border">
            <h2 className="text-xl font-bold mb-4">{isEditingCat ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <input type="text" placeholder="Category Name (e.g., Frontend)" className="w-full bg-surface border border-border rounded p-3 text-white" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required />
              
              <div className="space-y-1">
                <label className="text-sm text-text-muted">Display Order: {catForm.order}</label>
                <input type="number" placeholder="Order (0 = First)" className="w-full bg-surface border border-border rounded p-3 text-white" value={catForm.order} onChange={e => setCatForm({...catForm, order: parseInt(e.target.value) || 0})} required />
                <p className="text-xs text-text-muted">Lower numbers appear first.</p>
              </div>
              
              <div className="flex gap-4">
                <button type="submit" className="btn-primary w-full">{isEditingCat ? "Update" : "Add"}</button>
                {isEditingCat && <button type="button" onClick={resetCatForm} className="btn-outline w-full">Cancel</button>}
              </div>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-surface-elevated/50 border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border font-bold text-sm text-text-muted bg-surface/50">
                <div className="col-span-6">Category Name</div>
                <div className="col-span-3 text-center">Order</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>
              <div className="divide-y divide-border">
                {categories.map(cat => (
                  <div key={cat.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                    <div className="col-span-6 font-semibold text-white">{cat.name}</div>
                    <div className="col-span-3 text-center text-text-muted">{cat.order}</div>
                    <div className="col-span-3 flex justify-end gap-2">
                      <button onClick={() => handleCatEdit(cat)} className="p-2 text-primary hover:bg-primary/10 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => handleCatDelete(cat.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash size={16}/></button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="p-8 text-center text-text-muted">No categories found. Add one to get started!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

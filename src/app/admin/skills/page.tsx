"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash, Edit2 } from "lucide-react";

export default function AdminSkills() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", level: 80, categoryId: 1, technologies: "" });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/skills/${currentId}` : "/api/skills";
    const method = isEditing ? "PUT" : "POST";
    const payload = { ...formData, level: parseInt(formData.level as any), categoryId: parseInt(formData.categoryId as any) };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(`Skill ${isEditing ? "updated" : "added"}`);
      fetchSkills();
      resetForm();
    } else toast.error("Error saving");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({ name: item.name, level: item.level, categoryId: item.categoryId, technologies: item.technologies || "" });
  };

  const resetForm = () => {
    setIsEditing(false); setCurrentId(null);
    setFormData({ name: "", level: 80, categoryId: 1, technologies: "" });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Skills</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card p-6 h-fit border border-border">
          <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Skill" : "Add Skill"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Skill Name" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="number" placeholder="Category ID (1 for Core, 2 for Tech)" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})} required />
            <div className="space-y-1">
              <label className="text-sm text-text-muted">Proficiency: {formData.level}%</label>
              <input type="range" min="0" max="100" className="w-full" value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})} />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary w-full">{isEditing ? "Update" : "Add"}</button>
              {isEditing && <button type="button" onClick={resetForm} className="btn-outline w-full">Cancel</button>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map(item => (
              <div key={item.id} className="glass-card p-6 flex justify-between items-center border border-border group">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <div className="w-full bg-surface rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.level}%` }}></div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

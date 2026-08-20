"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash, Edit2 } from "lucide-react";

export default function AdminProjects() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", shortDesc: "", category: "Web", technologies: "", githubUrl: "", liveUrl: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/projects/${currentId}` : "/api/projects";
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) {
      toast.success(`Project ${isEditing ? "updated" : "added"}`);
      fetchProjects();
      resetForm();
    } else toast.error("Error saving");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        setFormData({ ...formData, imageUrl: json.url });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      toast.error("Upload error.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({ title: item.title, shortDesc: item.shortDesc, category: item.category, technologies: item.technologies, githubUrl: item.githubUrl || "", liveUrl: item.liveUrl || "", imageUrl: item.imageUrl || "" });
  };

  const resetForm = () => {
    setIsEditing(false); setCurrentId(null);
    setFormData({ title: "", shortDesc: "", category: "Web", technologies: "", githubUrl: "", liveUrl: "", imageUrl: "" });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Projects</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card p-6 h-fit border border-border">
          <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Project" : "Add Project"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Title" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input type="text" placeholder="Category" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <textarea placeholder="Short Description" rows={2} className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} required></textarea>
            <input type="text" placeholder="Technologies (CSV)" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} required />
            <input type="text" placeholder="Github URL" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
            <input type="text" placeholder="Live URL" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Project Image</label>
              <div className="flex gap-4 items-center">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-surface border border-border rounded p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                {uploading && <span className="text-sm text-primary">Uploading...</span>}
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded border border-border" />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" className="btn-primary w-full">{isEditing ? "Update" : "Add"}</button>
              {isEditing && <button type="button" onClick={resetForm} className="btn-outline w-full">Cancel</button>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {data.map(item => (
            <div key={item.id} className="glass-card p-6 flex justify-between items-start border border-border group">
              <div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-primary text-sm mb-2">{item.category}</p>
                <p className="text-text-muted">{item.shortDesc}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded"><Edit2 size={18}/></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

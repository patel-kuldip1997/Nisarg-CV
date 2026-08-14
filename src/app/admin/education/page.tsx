"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash, Edit2, Plus } from "lucide-react";

export default function AdminEducation() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ institution: "", degree: "", startDate: "", endDate: "", description: "" });

  useEffect(() => { fetchEducation(); }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        toast.error("Failed to load education data. Please restart server.");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/education/${currentId}` : "/api/education";
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) {
      toast.success(`Education ${isEditing ? "updated" : "added"}`);
      fetchEducation();
      resetForm();
    } else toast.error("Error saving");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/education/${id}`, { method: "DELETE" });
    fetchEducation();
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({ institution: item.institution, degree: item.degree, startDate: item.startDate, endDate: item.endDate, description: item.description || "" });
  };

  const resetForm = () => {
    setIsEditing(false); setCurrentId(null);
    setFormData({ institution: "", degree: "", startDate: "", endDate: "", description: "" });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Education</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card p-6 h-fit border border-border">
          <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Education" : "Add Education"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Institution" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required />
            <input type="text" placeholder="Degree" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required />
            <div className="flex gap-4">
              <input type="text" placeholder="Start Date" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              <input type="text" placeholder="End Date" className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>
            <textarea placeholder="Description" rows={3} className="w-full bg-surface border border-border rounded p-3 text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary w-full">{isEditing ? "Update" : "Add"}</button>
              {isEditing && <button type="button" onClick={resetForm} className="btn-outline w-full">Cancel</button>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {data.map(item => (
            <div key={item.id} className="glass-card p-6 flex justify-between items-start border border-border group">
              <div>
                <h3 className="text-xl font-bold text-white">{item.degree}</h3>
                <p className="text-primary">{item.institution}</p>
                <p className="text-sm text-text-muted">{item.startDate} - {item.endDate}</p>
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

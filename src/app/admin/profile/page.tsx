"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    name: "",
    primaryTitle: "",
    secondaryTitle: "",
    introduction: "",
    aboutSummary: "",
    yearsOfExp: "",
    technologies: "",
    issuesResolved: "",
    supportLevel: "",
    githubUrl: "",
    linkedinUrl: "",
    email: "",
    profileImage: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success) {
        const newUrl = result.url;
        setFormData(prev => ({ ...prev, profileImage: newUrl }));
        
        // Auto-save the new image to DB immediately
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, profileImage: newUrl })
        });
        
        toast.success("Photo uploaded & saved successfully!");
      } else {
        toast.error("Upload failed: " + result.error);
      }
    } catch (err) {
      toast.error("Error uploading photo.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          // Exclude ID and dates for the form
          const { id, createdAt, updatedAt, ...rest } = data;
          setFormData(prev => ({ ...prev, ...rest }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile data...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Profile</h1>
          <p className="text-text-muted">Update your public profile, about section, and contact links.</p>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="glass-card p-8 border border-border">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Full Name</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Primary Title</label>
              <input type="text" name="primaryTitle" value={formData.primaryTitle || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Secondary Title (Subtitle)</label>
              <input type="text" name="secondaryTitle" value={formData.secondaryTitle || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Introduction (Hero Section)</label>
              <textarea name="introduction" value={formData.introduction || ""} onChange={handleChange} rows={4} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"></textarea>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">About Summary</label>
              <textarea name="aboutSummary" value={formData.aboutSummary || ""} onChange={handleChange} rows={4} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"></textarea>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-border">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Statistics (About Page)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Years Exp.</label>
              <input type="text" name="yearsOfExp" value={formData.yearsOfExp || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Technologies</label>
              <input type="text" name="technologies" value={formData.technologies || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Issues Resolved</label>
              <input type="text" name="issuesResolved" value={formData.issuesResolved || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Support Level</label>
              <input type="text" name="supportLevel" value={formData.supportLevel || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-border">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Links & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Github URL</label>
              <input type="text" name="githubUrl" value={formData.githubUrl || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">LinkedIn URL</label>
              <input type="text" name="linkedinUrl" value={formData.linkedinUrl || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email Address</label>
              <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Profile Image</label>
              <div className="flex gap-4 items-center">
                <input type="text" name="profileImage" value={formData.profileImage || ""} onChange={handleChange} className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="/uploads/..." />
                <label className="btn-outline cursor-pointer px-4 py-3 shrink-0 flex items-center justify-center">
                  {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              {formData.profileImage && (
                <div className="mt-4 h-24 w-24 rounded-full overflow-hidden border-2 border-primary/50 relative">
                  <img src={formData.profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

export default function AdminProfile() {
  const [formData, setFormData] = useState<any>({
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
    profileImage: "",
    heroBadges: '[{"type":"text","value":"Technical Troubleshooting","icon":"Activity"},{"type":"text","value":"L1/L2 Support","icon":"Database"},{"type":"text","value":"API Integration","icon":"Cloud"},{"type":"text","value":"Python","icon":"Code2"}]'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsedBadges, setParsedBadges] = useState<any[]>([]);
  const [parsedRoles, setParsedRoles] = useState<{ roles: string[], fontStyle: string }>({ roles: [], fontStyle: 'font-sans' });

  useEffect(() => {
    try {
      if (formData.secondaryTitle) {
        const parsed = JSON.parse(formData.secondaryTitle);
        if (parsed.roles) {
          setParsedRoles(parsed);
        } else {
          setParsedRoles({ roles: formData.secondaryTitle.split(' • '), fontStyle: 'font-sans' });
        }
      }
    } catch(e) {
      if (formData.secondaryTitle) {
        setParsedRoles({ roles: formData.secondaryTitle.split(' • '), fontStyle: 'font-sans' });
      }
    }
  }, [formData.secondaryTitle]);

  const updateRoleSettings = (newSettings: { roles: string[], fontStyle: string }) => {
    setParsedRoles(newSettings);
    setFormData({ ...formData, secondaryTitle: JSON.stringify(newSettings) });
  };

  const addRole = () => {
    updateRoleSettings({ ...parsedRoles, roles: [...parsedRoles.roles, "New Role"] });
  };

  const removeRole = (index: number) => {
    const newRoles = parsedRoles.roles.filter((_, i) => i !== index);
    updateRoleSettings({ ...parsedRoles, roles: newRoles });
  };

  const updateRoleString = (index: number, val: string) => {
    const newRoles = [...parsedRoles.roles];
    newRoles[index] = val;
    updateRoleSettings({ ...parsedRoles, roles: newRoles });
  };

  useEffect(() => {
    try {
      if (formData.heroBadges) {
        setParsedBadges(JSON.parse(formData.heroBadges));
      }
    } catch(e) {}
  }, [formData.heroBadges]);

  const updateBadge = (index: number, field: string, value: any) => {
    const newBadges = [...parsedBadges];
    newBadges[index] = { ...(newBadges[index] || {}), [field]: value };
    setParsedBadges(newBadges);
    setFormData({ ...formData, heroBadges: JSON.stringify(newBadges) });
  };

  const addBadge = () => {
    const newBadges = [...parsedBadges, { type: 'image', value: '', icon: '' }];
    setParsedBadges(newBadges);
    setFormData({ ...formData, heroBadges: JSON.stringify(newBadges) });
  };

  const removeBadge = (index: number) => {
    const newBadges = parsedBadges.filter((_, i) => i !== index);
    setParsedBadges(newBadges);
    setFormData({ ...formData, heroBadges: JSON.stringify(newBadges) });
  };
  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
        updateBadge(index, 'value', result.url);
        toast.success("Badge image uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profileImage' | 'resumeUrl' = 'profileImage') => {
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
        setFormData((prev: any) => ({ ...prev, [fieldName]: newUrl }));
        
        // Auto-save the new file to DB immediately
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, [fieldName]: newUrl })
        });
        
        toast.success(`${fieldName === 'profileImage' ? 'Photo' : 'CV'} uploaded & saved successfully!`);
      } else {
        toast.error("Upload failed: " + result.error);
      }
    } catch (err) {
      toast.error("Error uploading file.");
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
          setFormData((prev: any) => ({ ...prev, ...rest }));
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
            <div className="space-y-4 md:col-span-2 p-4 bg-surface rounded-xl border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-medium text-text-muted">Secondary Titles (Typewriter Effect)</label>
                  <p className="text-xs text-text-muted mt-1">Add roles that will cycle with a typing animation.</p>
                </div>
                <button onClick={addRole} className="btn-outline px-3 py-1 text-xs">Add Role</button>
              </div>
              
              <div className="space-y-2">
                {parsedRoles.roles.map((role, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={role} 
                      onChange={(e) => updateRoleString(index, e.target.value)} 
                      className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary" 
                    />
                    <button onClick={() => removeRole(index)} className="text-red-500 hover:text-red-400 text-xs px-2">Remove</button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-text-muted block mb-2">Font Style for Typewriter</label>
                <select 
                  value={parsedRoles.fontStyle}
                  onChange={(e) => updateRoleSettings({ ...parsedRoles, fontStyle: e.target.value })}
                  className="w-full sm:w-1/2 bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="font-sans">Sans Serif (Modern)</option>
                  <option value="font-serif">Serif (Classic)</option>
                  <option value="font-mono">Monospace (Code)</option>
                  <option value="font-['Outfit']">Outfit (Rounded)</option>
                  <option value="font-['Inter']">Inter (Clean)</option>
                  <option value="italic">Italic</option>
                </select>
              </div>
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
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} disabled={uploading} />
                </label>
              </div>
              {formData.profileImage && (
                <div className="mt-4 h-24 w-24 rounded-full overflow-hidden border-2 border-primary/50 relative">
                  <img src={formData.profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-text-muted">Resume/CV (PDF or Word)</label>
              <div className="flex gap-4 items-center">
                <input type="text" name="resumeUrl" value={formData.resumeUrl || ""} onChange={handleChange} className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" placeholder="/uploads/..." />
                <label className="btn-outline cursor-pointer px-4 py-3 shrink-0 flex items-center justify-center">
                  {uploading ? "Uploading..." : "Upload CV"}
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resumeUrl')} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Badges Section */}
        <div className="glass-card p-8 border border-border">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-4">Floating Badges (Hero Section)</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-text-muted text-sm">Customize floating badges around your profile picture. You can add as many as you want!</p>
            <button onClick={addBadge} className="btn-primary px-4 py-2 text-sm">Add New Badge</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parsedBadges.map((badge, index) => {
              return (
                <div key={index} className="p-4 bg-surface rounded-xl border border-border space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-primary">Badge {index + 1}</h4>
                    <button onClick={() => removeBadge(index)} className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1">
                      Remove
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-2">Display Type</label>
                    <select 
                      value={badge.type || 'text'}
                      onChange={(e) => updateBadge(index, 'type', e.target.value)}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="text">Text & Icon</option>
                      <option value="image">Custom Image URL</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>

                  {badge.type === 'text' && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-text-muted block mb-2">Text Value</label>
                        <input 
                          type="text" 
                          value={badge.value || ''}
                          onChange={(e) => updateBadge(index, 'value', e.target.value)}
                          className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-muted block mb-2">Icon (Lucide Name)</label>
                        <input 
                          type="text" 
                          value={badge.icon || ''}
                          onChange={(e) => updateBadge(index, 'icon', e.target.value)}
                          placeholder="e.g. Code2, Cloud, Database"
                          className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </>
                  )}

                  {badge.type === 'image' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-muted block">Image / Icon URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={badge.value || ''}
                          onChange={(e) => updateBadge(index, 'value', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        />
                        <label className="btn-outline cursor-pointer px-3 py-2 text-sm shrink-0 flex items-center justify-center rounded">
                          {uploading ? "..." : "Upload"}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBadgeUpload(e, index)} disabled={uploading} />
                        </label>
                      </div>
                      {badge.value && (
                        <div className="mt-2 h-12 w-12 rounded-full overflow-hidden border border-border">
                          <img src={badge.value} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}

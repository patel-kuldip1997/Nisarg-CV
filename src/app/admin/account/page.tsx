"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Upload, KeyRound, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: ""
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          profileImage: data.profileImage || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgData = new FormData();
    imgData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: imgData });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, profileImage: data.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        profileImage: formData.profileImage
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Account updated successfully!");
        setFormData(prev => ({ ...prev, password: "" })); // Clear password field
      } else {
        const err = await res.json();
        toast.error(err.error || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <KeyRound className="text-primary" /> Admin Account Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-border text-center">
            <h2 className="text-xl font-bold mb-6 text-left">Profile Picture</h2>
            <div className="relative w-40 h-40 mx-auto mb-6 group">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface bg-surface flex items-center justify-center">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-text-muted" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Upload className="text-white mb-2" />
                <span className="text-white text-sm font-medium">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-sm text-text-muted">This image appears in the admin sidebar.</p>
          </div>
          
          <div className="glass-card p-6 border border-border border-l-4 border-l-secondary">
            <h3 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert size={18} className="text-secondary"/> Security Note</h3>
            <p className="text-sm text-text-muted">To reset your password via email, you must first configure SMTP credentials in your <code>.env</code> file.</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-8 border border-border">
          <h2 className="text-xl font-bold mb-6">Account Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-surface/50 border border-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                />
                <User className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email Address (For Password Reset)</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface/50 border border-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="admin@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">New Password (Leave blank to keep current)</label>
              <div className="relative">
                <input
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-surface/50 border border-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-3 px-8"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Lock, User } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-mesh z-0"></div>
      
      <div className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/30">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-text-muted">Enter your credentials to manage the portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Username</label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-surface-elevated border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-surface-elevated border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Link href="/admin/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit"  
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-70 flex justify-center"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

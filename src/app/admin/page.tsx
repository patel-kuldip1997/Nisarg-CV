"use client";

import { motion } from "framer-motion";
import { Users, FileText, Briefcase, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ projects: 0, experience: 0, skills: 0, unreadMessages: 0 });

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => {
      if(!data.error) setCounts(data);
    });
  }, []);

  const stats = [
    { title: "Total Projects", value: counts.projects, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Experience Roles", value: counts.experience, icon: Briefcase, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Total Skills", value: counts.skills, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Unread Messages", value: counts.unreadMessages, icon: Mail, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-text-muted">Welcome to your portfolio administration panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border border-border flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 border border-border">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/admin/projects" className="btn-outline text-center">Manage Projects</a>
          <a href="/admin/profile" className="btn-outline text-center">Update Profile</a>
          <a href="/admin/messages" className="btn-outline text-center">View Messages</a>
        </div>
      </div>
    </div>
  );
}

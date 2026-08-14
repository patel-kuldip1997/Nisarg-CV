"use client";

import Link from "next/link";
import { LayoutDashboard, User, Briefcase, FileText, Settings, Mail, LogOut, Menu, X, Star, Palette, FolderKanban } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Skills", href: "/admin/skills", icon: FileText },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    { label: "Theme", href: "/admin/theme", icon: Palette },
    { label: "Messages", href: "/admin/messages", icon: Mail },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-elevated border-r border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-sm">KP</div>
          Admin
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${pathname === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-surface hover:text-white'}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface-elevated border border-border rounded-lg text-white"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 z-50"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 -right-12 p-2 bg-surface-elevated border border-border rounded-lg text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

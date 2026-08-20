"use client";

import Link from "next/link";
import { LayoutDashboard, User, Briefcase, FileText, Settings, Mail, Power, Menu, X, Star, Palette, FolderKanban, LayoutTemplate, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isCollapsed = false, setIsCollapsed = () => {} }: { isCollapsed?: boolean, setIsCollapsed?: (v: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if(data && data.username) setAdminUser(data);
    }).catch(() => {});
    
    fetch('/api/profile').then(res => res.json()).then(data => {
      if(data) setProfile(data);
    }).catch(() => {});
    
    fetch('/api/theme').then(res => res.json()).then(data => {
      if(data) setTheme(data);
    }).catch(() => {});
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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
    { label: "Page Builder", href: "/admin/builder", icon: LayoutTemplate },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Skills", href: "/admin/skills", icon: FileText },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    { label: "Theme", href: "/admin/theme", icon: Palette },
    { label: "Messages", href: "/admin/messages", icon: Mail },
  ];

  const SidebarContent = () => {
    const fallbackText = theme?.logoText ? theme.logoText.substring(0, 2).toUpperCase() : getInitials(profile?.name);
    
    return (
      <div className="flex flex-col h-full bg-surface-elevated border-r border-border transition-all duration-300 relative">
        {/* Toggle Button for Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-primary text-white items-center justify-center rounded-full z-50 hover:scale-110 transition-transform shadow-lg"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-6 border-b border-border flex items-center ${isCollapsed ? 'justify-center px-4' : 'gap-3'}`}>
          {theme?.logoType === 'image' && theme?.logoImageUrl ? (
            <img src={theme.logoImageUrl} alt="Logo" className="w-8 h-8 rounded object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-sm font-black text-white shrink-0 shadow-lg shadow-primary/20">
              {fallbackText}
            </div>
          )}
          {!isCollapsed && <span className="truncate font-bold text-white text-lg">{theme?.logoText || "ADMIN Panel"}</span>}
        </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            onClick={() => setIsOpen(false)}
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-300 font-medium text-sm group ${pathname === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-surface hover:text-white'}`}
          >
            <item.icon size={20} className={`transition-transform duration-300 ${pathname !== item.href && 'group-hover:scale-110'}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Link 
          href="/admin/account"
          onClick={() => setIsOpen(false)}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'} mb-3 rounded-xl hover:bg-surface transition-colors border border-transparent hover:border-border`}
          title={isCollapsed ? "Account Settings" : undefined}
        >
          {adminUser?.profileImage ? (
            <img src={adminUser.profileImage} alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-text-muted shrink-0">
              <User size={20} />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{adminUser?.username || 'Admin'}</p>
              <p className="text-xs text-text-muted truncate mt-0.5">Account Settings</p>
            </div>
          )}
        </Link>
        <button 
          onClick={handleLogout} 
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl text-error hover:bg-error/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300 font-medium text-sm border border-transparent hover:border-error/20`}
        >
          <Power size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-surface-elevated border border-border rounded-xl text-white shadow-lg hover:bg-surface transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-64'} z-40 transition-all duration-300`}>
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
                className="absolute top-4 -right-14 p-2.5 bg-error text-white rounded-xl shadow-lg hover:bg-error/90 transition-colors"
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

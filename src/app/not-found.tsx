"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Home, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background VFX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-12 max-w-lg w-full text-center border border-border shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        
        <p className="text-text-muted mb-8 leading-relaxed">
          The page you are looking for doesn't exist or is currently under construction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAdminRoute ? (
            <Link href="/admin" className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
              <LayoutDashboard size={18} />
              Back to Admin
            </Link>
          ) : (
            <Link href="/" className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
              <Home size={18} />
              Back to Home
            </Link>
          )}
          {isAdminRoute && (
            <Link href="/" className="btn-outline flex items-center justify-center gap-2 px-6 py-3">
              <Home size={18} />
              View Frontend
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // In Next.js not-found.tsx, pathname might be null on server or during hydration sometimes, 
    // but useful for client-side logging if available.
    if (pathname) {
        console.error("404 Error: User attempted to access non-existent route:", pathname);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold mb-4 tracking-tight">404</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
          This page doesn't exist in your financial universe.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

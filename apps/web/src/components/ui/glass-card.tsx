
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hoverEffect?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  gradient = false,
  hoverEffect = true,
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl",
        gradient && "bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent",
        className
      )}
      whileHover={hoverEffect ? { 
        y: -4,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
        backgroundColor: "rgba(255,255,255,0.08)"
      } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
        {/* Shine effect on top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
      
       {/* Decorative gradient blob in background */}
       {gradient && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
       )}
    </motion.div>
  );
}

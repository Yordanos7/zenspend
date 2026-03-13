"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Receipt,
    Target,
    BarChart3,
    BrainCircuit,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Budgets", href: "/budget", icon: Wallet },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "AI Coach", href: "/ai-coach", icon: BrainCircuit },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? "80px" : "260px" }}
            className={cn(
                "relative h-screen bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out z-50",
                "hidden md:flex"
            )}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <img src="/logo.png" alt="ZenSpend" className="w-5 h-5 object-contain invert grayscale brightness-200" />
                </div>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-lg font-bold text-slate-900 dark:text-white truncate"
                        >
                            ZenSpend
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-10"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                )}
            </button>

            {/* Links Section */}
            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                        <Link key={link.href} href={link.href}>
                            <div
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <link.icon className={cn(
                                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                                )} />

                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-sm font-medium truncate"
                                        >
                                            {link.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                )}>
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-sm font-medium"
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}

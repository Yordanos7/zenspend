"use client";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Home } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/goals", label: "Goals", icon: Sparkles },
  ] as const;

  return (
    <header className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between py-3">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-xl font-bold transition-all hover:opacity-90"
          >
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-transparent transition-all group-hover:scale-105">
                 <img src="/logo.png" alt="ZenSpend AI Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-slate-900 dark:text-white">
              ZenSpend
            </span>

          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {links.map(({ to, label, icon: Icon }) => {
              return (
                <Link
                  key={to}
                  href={to as any}
                  className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-all hover:text-primary dark:text-slate-400 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

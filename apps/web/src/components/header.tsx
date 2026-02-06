"use client";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Home, Wallet } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all group-hover:shadow-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-slate-900 dark:text-white">
              ZenSpend
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {links.map(({ to, label, icon: Icon }) => {
              return (
                <Link
                  key={to}
                  href={to}
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

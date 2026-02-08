"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-20 md:pt-32 lg:pt-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20" />
        
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-row lg:justify-between lg:gap-12">
            
            {/* Left Content */}
            <div className="max-w-2xl lg:pt-8 relative z-10">
              <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>The Future of Personal Finance</span>
                </span>
              </div>
              
              <div className="mb-8">
                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-7xl leading-[1.1]">
                  FINANCIAL CLARITY,
                  <br />
                  <span className="text-primary dark:text-[#60A5FA]">
                    AI-POWERED
                  </span>
                </h1>
                <p className="mx-auto max-w-xl text-lg text-slate-600 dark:text-slate-300 lg:mx-0 lg:text-xl leading-relaxed">
                  ZenSpend AI turns raw financial data into clear insights using artificial intelligence. 
                  Upload statements, ask questions, and get instant answers to make smarter money decisions effortlessly.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="h-14 min-w-[180px] rounded-full bg-primary hover:bg-primary/90 px-8 text-lg font-semibold text-primary-foreground shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                  >
                    START FOR FREE
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 min-w-[180px] rounded-full border-slate-200 bg-white px-8 text-lg font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  LEARN MORE
                </Button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative mx-auto w-full max-w-[650px] lg:mx-0 lg:max-w-none flex justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="absolute -inset-4 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-900/20 z-0" />
              <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Hero image placeholder or re-add the image if updating public folder */}
                 <div className="relative aspect-square w-full max-w-md mx-auto hidden md:block">
                     {/* If the image was deleted or not present, we can use a mockup or ensure it exists. 
                         For now, I will assume the image path is valid or provide a safe fallback if needed.
                         The user script had "/hero-tablet-royal.png". I'll trust it exists or use a div fallback.
                      */}
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 shadow-2xl backdrop-blur-sm flex items-center justify-center">
                        <BarChart3 className="w-32 h-32 text-primary/50" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 dark:bg-slate-950 relative z-20 shadow-sm border-t border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 transition-transform group-hover:scale-110">
                <BarChart3 className="h-10 w-10 text-primary dark:text-[#60A5FA]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                AUTOMATED INSIGHTS
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                AI analyzes spending patterns to visualize your financial health instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 transition-transform group-hover:scale-110">
                <MessageSquare className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                NATURAL LANGUAGE
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Ask questions like "How much did I spend on food?" and get instant answers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 transition-transform group-hover:scale-110">
                <ShieldCheck className="h-10 w-10 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                SECURE & PRIVATE
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your financial data is encrypted and protected with enterprise-grade security.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

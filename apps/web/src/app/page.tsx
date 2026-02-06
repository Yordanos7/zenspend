"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBackground from "@/components/hero-background";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-[#0F172A] dark:to-slate-950 py-12 lg:py-20 lg:min-h-[800px] flex items-center">
        {/* Live Animated Background */}
        <HeroBackground />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-7xl leading-tight">
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
                <Button 
                  size="lg" 
                  className="h-14 min-w-[180px] rounded-full bg-primary hover:bg-primary/90 px-8 text-lg font-semibold text-primary-foreground shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                >
                  START FOR FREE
                </Button>
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
            <div className="relative mx-auto w-full max-w-[650px] lg:mx-0 lg:max-w-none flex justify-center lg:justify-end">
              <div className="absolute -inset-4 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-900/20 z-0" />
              <div className="relative z-10 w-full">
                <Image
                  src="/hero-tablet-royal.png"
                  alt="ZenSpend AI Dashboard on Tablet"
                  width={800}
                  height={800}
                  priority
                  className="drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 object-contain"
                />
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Scan,
  FileText,
  CreditCard,
  X
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BudgetBurnRate } from "@/components/dashboard/BudgetBurnRate";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { ReceiptUploader } from "@/components/dashboard/ReceiptUploader";
import { Button } from "@/components/ui/button";


export default function Dashboard() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white">
              Financial Overview
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back! Here's what's happening with your money today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              onClick={() => setIsScannerOpen(true)}
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Receipt
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions / Integration */}
        <AnimatePresence>
          {isScannerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="relative p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <button
                  onClick={() => setIsScannerOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
                <div className="flex flex-col items-center text-center mb-6">
                  <h3 className="text-xl font-bold text-primary">AI Receipt Scanner</h3>
                  <p className="text-sm text-primary/70 max-w-sm">
                    Upload a clear photo of your receipt and our AI will automatically extract the details for you.
                  </p>
                </div>
                <ReceiptUploader />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Balance"
              value="Birr 12,450.00"
              icon={<Wallet className="w-5 h-5 text-primary" />}
              variant="primary"
              trend="up"
              trendValue="+2.5%"
            />
            <StatCard
              title="Monthly Income"
              value="Birr 4,250.00"
              icon={<ArrowUpRight className="w-5 h-5 text-success" />}
              variant="success"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Monthly Expenses"
              value="Birr 1,235.00"
              icon={<ArrowDownRight className="w-5 h-5 text-destructive" />}
              variant="default" // Using default but could be warning/destructive style if defined
              trend="down"
              trendValue="-5% from last month"
            />
            <StatCard
              title="Savings Goal"
              value="Birr 8,000.00"
              subtitle="Target: Birr 10,000"
              icon={<TrendingUp className="w-5 h-5 text-warning" />}
              variant="warning"
              trend="up"
              trendValue="80% Completed"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BudgetBurnRate />
                <div className="h-full">
                  <CategoryDonut />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InsightCard
                    insight="You've spent 20% less on dining out compared to last month. Great job sticking to your budget!"
                    type="positive"
                  />
                  <InsightCard
                    insight="Subscription costs have risen by 15%. Consider reviewing your recurring payments."
                    type="warning"
                  />
                  <InsightCard
                    insight="Based on your current spending, you're projected to save Birr 450 this month."
                    type="neutral"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="lg:col-span-1 h-full">
              <RecentTransactions />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

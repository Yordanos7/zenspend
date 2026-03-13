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
  X,
  Sparkles,
  Zap,
  Target
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BudgetBurnRate } from "@/components/dashboard/BudgetBurnRate";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { ReceiptUploader } from "@/components/dashboard/ReceiptUploader";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { GoalsOverview } from "@/components/dashboard/GoalsOverview";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { Button } from "@/components/ui/button";
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function Dashboard() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  // Fetch real data for stats
  const { data: transactions = [] } = trpc.transaction.getAll.useQuery();
  const { data: budgets = [] } = trpc.budget.getAll.useQuery();
  const { data: goals = [] } = trpc.goal.getAll.useQuery();
  
  // Calculate real stats
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
  
  const totalBalance = totalIncome - totalExpenses;
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetUsage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const goalProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Financial Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Welcome back! Here's your financial overview</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/transactions">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
            <Button
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
              onClick={() => setIsScannerOpen(true)}
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Receipt
            </Button>
          </div>
        </motion.div>

        {/* AI Receipt Scanner */}
        <AnimatePresence>
          {isScannerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="relative p-8 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent backdrop-blur-sm shadow-xl">
                <button
                  onClick={() => setIsScannerOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">AI Receipt Scanner</h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed">
                    Upload a clear photo of your receipt and our AI will automatically extract transaction details, 
                    categorize expenses, and add them to your financial records.
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
          className="space-y-8"
        >
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Balance"
              value={`Birr ${totalBalance.toLocaleString()}`}
              icon={<Wallet className="w-6 h-6" />}
              variant="primary"
              trend={totalBalance > 0 ? "up" : "down"}
              trendValue={totalBalance > 0 ? "+" + ((totalBalance / Math.max(totalIncome, 1)) * 100).toFixed(1) + "%" : "Low balance"}
              className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg hover:shadow-primary/10"
            />
            <StatCard
              title="Monthly Income"
              value={`Birr ${totalIncome.toLocaleString()}`}
              icon={<ArrowUpRight className="w-6 h-6" />}
              variant="success"
              trend="up"
              trendValue={`${transactions.filter(t => t.amount > 0).length} transactions`}
              className="bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:shadow-lg hover:shadow-success/10"
            />
            <StatCard
              title="Monthly Expenses"
              value={`Birr ${totalExpenses.toLocaleString()}`}
              icon={<ArrowDownRight className="w-6 h-6" />}
              variant="warning"
              trend={budgetUsage > 80 ? "up" : "down"}
              trendValue={`${budgetUsage}% of budget`}
              className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20 hover:shadow-lg hover:shadow-warning/10"
            />
            <StatCard
              title="Goals Progress"
              value={`${goalProgress}%`}
              subtitle={`${goals.filter(g => (g.current/g.target) >= 1).length} of ${goals.length} completed`}
              icon={<Target className="w-6 h-6" />}
              variant="info"
              trend="up"
              trendValue={`Birr ${totalGoalSaved.toLocaleString()} saved`}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-200/20"
            />
          </div>

          {/* Main Dashboard Grid - Professional Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Section - Charts & Analytics */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Top Row - Budget & Spending */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                  <BudgetBurnRate />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                  <CategoryDonut />
                </div>
              </div>

              {/* AI Insights Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">AI Financial Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <InsightCard
                    insight="You've spent 20% less on dining compared to last month. Great progress on your budget goals!"
                    type="positive"
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
                  />
                  <InsightCard
                    insight="Your subscription costs have increased by 15%. Consider reviewing recurring payments to optimize spending."
                    type="warning"
                    className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800"
                  />
                  <InsightCard
                    insight="Based on current trends, you're projected to save Birr 2,450 this month. You're ahead of your savings goal!"
                    type="neutral"
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800"
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Activity & Quick Actions */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Recent Transactions */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                <RecentTransactions />
              </div>

              {/* Budget & Goals Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                  <BudgetOverview />
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                  <GoalsOverview />
                </div>
              </div>

              {/* Analytics Overview */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
                <AnalyticsOverview />
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/transactions">
                    <Button className="w-full justify-start rounded-xl" variant="ghost">
                      <Plus className="w-4 h-4 mr-3" />
                      Add Transaction
                    </Button>
                  </Link>
                  <Link href="/budget">
                    <Button className="w-full justify-start rounded-xl" variant="ghost">
                      <Target className="w-4 h-4 mr-3" />
                      Set Budget
                    </Button>
                  </Link>
                  <Link href="/goals">
                    <Button className="w-full justify-start rounded-xl" variant="ghost">
                      <TrendingUp className="w-4 h-4 mr-3" />
                      Create Goal
                    </Button>
                  </Link>
                  <Button 
                    className="w-full justify-start rounded-xl" 
                    variant="ghost"
                    onClick={() => setIsScannerOpen(true)}
                  >
                    <Scan className="w-4 h-4 mr-3" />
                    Scan Receipt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

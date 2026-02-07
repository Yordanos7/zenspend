"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BudgetBurnRate } from "@/components/dashboard/BudgetBurnRate";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InsightCard } from "@/components/dashboard/InsightCard";

export default function Dashboard() {
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

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
              value="$12,450.00"
              icon={<Wallet className="w-5 h-5 text-primary" />}
              variant="primary"
              trend="up"
              trendValue="+2.5%"
            />
            <StatCard
              title="Monthly Income"
              value="$4,250.00"
              icon={<ArrowUpRight className="w-5 h-5 text-success" />}
              variant="success"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Monthly Expenses"
              value="$1,235.00"
              icon={<ArrowDownRight className="w-5 h-5 text-destructive" />}
              variant="default" // Using default but could be warning/destructive style if defined
              trend="down"
              trendValue="-5% from last month"
            />
             <StatCard
              title="Savings Goal"
              value="$8,000.00"
              subtitle="Target: $10,000"
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
                    insight="Based on your current spending, you're projected to save $450 this month." 
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

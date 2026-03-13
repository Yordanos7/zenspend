import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, TrendingDown, ArrowRight, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function AnalyticsOverview() {
  const { data: transactions = [], isLoading } = trpc.transaction.getAll.useQuery();
  const { data: budgets = [] } = trpc.budget.getAll.useQuery();
  const { data: goals = [] } = trpc.goal.getAll.useQuery();
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Financial Analytics</h3>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Calculate analytics
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
  
  const netWorth = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  
  const completedGoals = goals.filter(g => (g.current / g.target) >= 1).length;
  const budgetsOnTrack = budgets.filter(b => b.percentage <= 80).length;
  
  // Generate mini chart data (last 7 days)
  const chartData = generateMiniChartData(transactions);
  
  const healthScore = calculateHealthScore({
    savingsRate,
    budgetsOnTrack,
    totalBudgets: budgets.length,
    completedGoals,
    totalGoals: goals.length
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Financial Analytics</h3>
        </div>
        <Link
          href="/analytics"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Financial Health Score */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">FINANCIAL HEALTH</p>
            <div className="flex items-center gap-2">
              <div className={cn("text-2xl font-bold", getHealthColor(healthScore))}>
                {healthScore}
              </div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground">7-DAY SPENDING TREND</p>
          <div className="flex items-center gap-1 text-xs">
            {netWorth >= 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={netWorth >= 0 ? "text-emerald-600" : "text-red-600"}>
              {Math.abs(((netWorth / Math.max(totalIncome, 1)) * 100)).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Net Worth</span>
          <span className={cn(
            "text-sm font-bold",
            netWorth >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            Birr {Math.abs(netWorth).toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Savings Rate</span>
          <span className={cn(
            "text-sm font-bold",
            savingsRate >= 20 ? "text-emerald-600" : 
            savingsRate >= 10 ? "text-yellow-600" : "text-red-600"
          )}>
            {savingsRate}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Goals Completed</span>
          <span className="text-sm font-bold text-foreground">
            {completedGoals}/{goals.length}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Budgets On Track</span>
          <span className="text-sm font-bold text-foreground">
            {budgetsOnTrack}/{budgets.length}
          </span>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
          <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">AI INSIGHT</p>
            <p className="text-xs text-foreground leading-relaxed">
              {generateQuickInsight(savingsRate, budgetsOnTrack, budgets.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-4">
        <Link
          href="/analytics"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
        >
          <BarChart3 className="w-4 h-4" />
          View Full Analytics
        </Link>
      </div>
    </motion.div>
  );
}

function generateMiniChartData(transactions: any[]) {
  const last7Days = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.toDateString() === date.toDateString();
    });
    
    const amount = Math.abs(dayTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    last7Days.push({
      day: date.getDate(),
      amount
    });
  }
  
  return last7Days;
}

function calculateHealthScore(data: {
  savingsRate: number;
  budgetsOnTrack: number;
  totalBudgets: number;
  completedGoals: number;
  totalGoals: number;
}): number {
  let score = 0;
  
  // Savings rate (30 points)
  if (data.savingsRate >= 20) score += 30;
  else if (data.savingsRate >= 10) score += 20;
  else if (data.savingsRate >= 5) score += 10;
  
  // Budget adherence (25 points)
  const budgetScore = (data.budgetsOnTrack / Math.max(data.totalBudgets, 1)) * 25;
  score += budgetScore;
  
  // Goal progress (25 points)
  const goalScore = (data.completedGoals / Math.max(data.totalGoals, 1)) * 25;
  score += goalScore;
  
  // Base financial activity (20 points)
  if (data.totalBudgets > 0 && data.totalGoals > 0) score += 20;
  else if (data.totalBudgets > 0 || data.totalGoals > 0) score += 10;
  
  return Math.round(Math.min(score, 100));
}

function generateQuickInsight(savingsRate: number, budgetsOnTrack: number, totalBudgets: number): string {
  if (savingsRate >= 20) {
    return "Excellent savings rate! You're building wealth effectively.";
  } else if (budgetsOnTrack === totalBudgets && totalBudgets > 0) {
    return "Perfect budget adherence! Consider increasing your savings goals.";
  } else if (savingsRate < 5) {
    return "Focus on increasing your savings rate to build financial security.";
  } else {
    return "Good progress! Consider optimizing expenses to boost savings.";
  }
}
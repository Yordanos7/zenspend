"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar,
  Download, Filter, RefreshCw, Target, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Award,
  ChevronDown, Eye, FileText, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'line' | 'area' | 'bar';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch data
  const { data: transactions = [], isLoading: transactionsLoading } = trpc.transaction.getAll.useQuery();
  const { data: budgets = [] } = trpc.budget.getAll.useQuery();
  const { data: goals = [] } = trpc.goal.getAll.useQuery();
  const { data: spendingData = [] } = trpc.transaction.getSpendingByCategory.useQuery();

  // Calculate analytics data
  const analyticsData = calculateAnalytics(transactions, budgets, goals, dateRange);

  if (transactionsLoading) {
    return <AnalyticsLoadingState />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Financial Analytics
                </h1>
                <p className="text-muted-foreground text-lg">Deep insights into your financial patterns</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DateRangeSelector dateRange={dateRange} onChange={setDateRange} />
            <Button variant="outline" size="lg" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Financial Health Score */}
        <FinancialHealthScore data={analyticsData} />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Net Worth"
            value={`Birr ${analyticsData.netWorth.toLocaleString()}`}
            change={analyticsData.netWorthChange}
            icon={<Wallet className="w-6 h-6" />}
            trend={analyticsData.netWorthChange >= 0 ? 'up' : 'down'}
            color="blue"
          />
          <AnalyticsCard
            title="Monthly Income"
            value={`Birr ${analyticsData.monthlyIncome.toLocaleString()}`}
            change={analyticsData.incomeChange}
            icon={<ArrowUpRight className="w-6 h-6" />}
            trend={analyticsData.incomeChange >= 0 ? 'up' : 'down'}
            color="green"
          />
          <AnalyticsCard
            title="Monthly Expenses"
            value={`Birr ${analyticsData.monthlyExpenses.toLocaleString()}`}
            change={analyticsData.expenseChange}
            icon={<ArrowDownRight className="w-6 h-6" />}
            trend={analyticsData.expenseChange <= 0 ? 'up' : 'down'}
            color="red"
          />
          <AnalyticsCard
            title="Savings Rate"
            value={`${analyticsData.savingsRate}%`}
            change={analyticsData.savingsRateChange}
            icon={<Target className="w-6 h-6" />}
            trend={analyticsData.savingsRateChange >= 0 ? 'up' : 'down'}
            color="purple"
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Income vs Expenses Chart */}
          <div className="col-span-12 lg:col-span-8">
            <IncomeExpenseChart 
              data={analyticsData.monthlyTrends} 
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>

          {/* Category Breakdown */}
          <div className="col-span-12 lg:col-span-4">
            <CategoryBreakdown data={spendingData} />
          </div>

          {/* Spending Trends */}
          <div className="col-span-12 lg:col-span-6">
            <SpendingTrends data={analyticsData.spendingTrends} />
          </div>

          {/* Budget Performance */}
          <div className="col-span-12 lg:col-span-6">
            <BudgetPerformance budgets={budgets} />
          </div>

          {/* Goals Progress */}
          <div className="col-span-12 lg:col-span-4">
            <GoalsProgress goals={goals} />
          </div>

          {/* Predictive Analytics */}
          <div className="col-span-12 lg:col-span-8">
            <PredictiveAnalytics data={analyticsData} />
          </div>
        </div>

        {/* AI Insights & Recommendations */}
        <AIInsightsPanel data={analyticsData} />
      </div>
    </main>
  );
}

// Helper function to calculate analytics
function calculateAnalytics(transactions: any[], budgets: any[], goals: any[], dateRange: DateRange) {
  const now = new Date();
  const startDate = getStartDate(now, dateRange);
  
  const filteredTransactions = transactions.filter(t => 
    new Date(t.date) >= startDate
  );

  const income = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = Math.abs(filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const netWorth = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  // Generate monthly trends
  const monthlyTrends = generateMonthlyTrends(transactions);
  const spendingTrends = generateSpendingTrends(transactions);

  return {
    netWorth,
    netWorthChange: 12.5, // Mock data - would calculate from previous period
    monthlyIncome: income,
    incomeChange: 8.2,
    monthlyExpenses: expenses,
    expenseChange: -5.1,
    savingsRate,
    savingsRateChange: 3.2,
    monthlyTrends,
    spendingTrends,
    totalGoals: goals.length,
    completedGoals: goals.filter(g => (g.current / g.target) >= 1).length,
    totalBudgets: budgets.length,
    budgetsOnTrack: budgets.filter(b => b.percentage <= 80).length,
  };
}

function getStartDate(now: Date, range: DateRange): Date {
  const date = new Date(now);
  switch (range) {
    case '7d':
      date.setDate(date.getDate() - 7);
      break;
    case '30d':
      date.setDate(date.getDate() - 30);
      break;
    case '90d':
      date.setDate(date.getDate() - 90);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setFullYear(2020); // All time
  }
  return date;
}

function generateMonthlyTrends(transactions: any[]) {
  // Generate last 12 months of data
  const months = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    });
    
    const income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = Math.abs(monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expenses,
      net: income - expenses
    });
  }
  
  return months;
}

function generateSpendingTrends(transactions: any[]) {
  // Generate daily spending for last 30 days
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.toDateString() === date.toDateString();
    });
    
    const spending = Math.abs(dayTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      spending
    });
  }
  
  return days;
}
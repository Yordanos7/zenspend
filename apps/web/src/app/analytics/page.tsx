"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar,
  Download, Filter, RefreshCw, Target, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Award,
  ChevronDown, Eye, FileText, Share2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
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
// Component: Analytics Loading State
function AnalyticsLoadingState() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded w-96 mb-4"></div>
          <div className="h-6 bg-muted rounded w-64"></div>
        </div>
        <div className="h-32 bg-muted rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 h-96 bg-muted rounded-3xl animate-pulse"></div>
          <div className="col-span-4 h-96 bg-muted rounded-3xl animate-pulse"></div>
        </div>
      </div>
    </main>
  );
}

// Component: Date Range Selector
function DateRangeSelector({ dateRange, onChange }: { dateRange: DateRange; onChange: (range: DateRange) => void }) {
  const ranges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value as DateRange)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            dateRange === range.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

// Component: Financial Health Score
function FinancialHealthScore({ data }: { data: any }) {
  const healthScore = calculateHealthScore(data);
  const getHealthColor = (score: number) => {
    if (score >= 80) return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Excellent' };
    if (score >= 60) return { color: 'text-blue-600', bg: 'bg-blue-500', label: 'Good' };
    if (score >= 40) return { color: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-500', label: 'Needs Improvement' };
  };

  const health = getHealthColor(healthScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Financial Health Score</h3>
          <p className="text-muted-foreground">Overall assessment of your financial wellness</p>
        </div>
        <div className="text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted/20"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${healthScore}, 100`}
                className={health.color}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={cn("text-3xl font-bold", health.color)}>{healthScore}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
          <div className={cn("px-4 py-2 rounded-full text-sm font-medium", health.color, "bg-current/10")}>
            {health.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function calculateHealthScore(data: any): number {
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
  
  // Income stability (20 points)
  if (data.incomeChange >= 0) score += 20;
  else if (data.incomeChange >= -5) score += 15;
  else if (data.incomeChange >= -10) score += 10;
  
  return Math.round(Math.min(score, 100));
}

// Component: Analytics Card
function AnalyticsCard({ title, value, change, icon, trend, color }: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
    green: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800',
    red: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br',
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-2xl', iconColors[color])}>
          {icon}
        </div>
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
          trend === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        )}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

// Component: Income vs Expense Chart
function IncomeExpenseChart({ data, chartType, onChartTypeChange }: {
  data: any[];
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}) {
  const ChartComponent = chartType === 'line' ? LineChart : chartType === 'area' ? AreaChart : BarChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Income vs Expenses</h3>
          <p className="text-muted-foreground">Monthly financial flow analysis</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          {(['line', 'area', 'bar'] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-all capitalize",
                chartType === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {chartType === 'line' ? (
              <>
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
              </>
            ) : chartType === 'area' ? (
              <>
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </>
            ) : (
              <>
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Component: Category Breakdown
function CategoryBreakdown({ data }: { data: any[] }) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Category Breakdown</h3>
        <p className="text-muted-foreground">Spending distribution by category</p>
      </div>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium text-foreground capitalize">{item.category}</span>
            </div>
            <span className="text-sm font-bold text-foreground">
              Birr {item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Component: Spending Trends
function SpendingTrends({ data }: { data: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Daily Spending Trends</h3>
        <p className="text-muted-foreground">Last 30 days spending pattern</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="spending" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Component: Budget Performance
function BudgetPerformance({ budgets }: { budgets: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Budget Performance</h3>
        <p className="text-muted-foreground">How well you're sticking to budgets</p>
      </div>
      
      <div className="space-y-4">
        {budgets.slice(0, 5).map((budget, index) => (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground capitalize">
                {budget.category.name}
              </span>
              <span className={cn(
                "text-sm font-bold",
                budget.percentage > 100 ? "text-red-600" :
                budget.percentage > 80 ? "text-yellow-600" : "text-green-600"
              )}>
                {budget.percentage}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={cn(
                  "h-full rounded-full",
                  budget.percentage > 100 ? "bg-red-500" :
                  budget.percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Birr {budget.spent.toLocaleString()}</span>
              <span>Birr {budget.limit.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Component: Goals Progress
function GoalsProgress({ goals }: { goals: any[] }) {
  const completedGoals = goals.filter(g => (g.current / g.target) >= 1).length;
  const totalProgress = goals.length > 0 ? 
    goals.reduce((sum, g) => sum + (g.current / g.target), 0) / goals.length * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">Goals Progress</h3>
        <p className="text-muted-foreground">Financial goals achievement</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-foreground mb-2">
          {completedGoals}/{goals.length}
        </div>
        <p className="text-muted-foreground">Goals Completed</p>
        <div className="mt-4">
          <div className="text-2xl font-bold text-primary">{totalProgress.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Average Progress</p>
        </div>
      </div>

      <div className="space-y-3">
        {goals.slice(0, 3).map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {goal.name}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Component: Predictive Analytics
function PredictiveAnalytics({ data }: { data: any }) {
  const predictions = generatePredictions(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          AI Predictions
        </h3>
        <p className="text-muted-foreground">Smart forecasts based on your patterns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <div className="text-2xl font-bold text-foreground mb-1">
            Birr {predictions.nextMonthSpending.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">Predicted Next Month Spending</p>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <div className="text-2xl font-bold text-foreground mb-1">
            {predictions.savingsGoalDate}
          </div>
          <p className="text-sm text-muted-foreground">Emergency Fund Goal Date</p>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <div className="text-2xl font-bold text-foreground mb-1">
            Birr {predictions.yearEndSavings.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">Projected Year-End Savings</p>
        </div>
      </div>
    </motion.div>
  );
}

function generatePredictions(data: any) {
  return {
    nextMonthSpending: data.monthlyExpenses * 1.05, // 5% increase prediction
    savingsGoalDate: "Mar 2025", // Mock prediction
    yearEndSavings: data.netWorth * 1.2 // 20% growth prediction
  };
}

// Component: AI Insights Panel
function AIInsightsPanel({ data }: { data: any }) {
  const insights = generateAIInsights(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          AI Financial Insights & Recommendations
        </h3>
        <p className="text-muted-foreground">Personalized advice based on your financial patterns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-6 rounded-2xl border shadow-sm",
              insight.type === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' :
              insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
              'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                insight.type === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              )}>
                {insight.icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
                {insight.action && (
                  <Button variant="outline" size="sm" className="mt-3">
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function generateAIInsights(data: any) {
  return [
    {
      type: 'positive',
      icon: <TrendingUp className="w-4 h-4" />,
      title: 'Great Savings Progress',
      message: `Your savings rate of ${data.savingsRate}% is above the recommended 20%. Keep up the excellent work!`,
      action: 'View Goals'
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="w-4 h-4" />,
      title: 'Budget Alert',
      message: `You're approaching limits in ${data.totalBudgets - data.budgetsOnTrack} categories. Consider reviewing your spending.`,
      action: 'Review Budgets'
    },
    {
      type: 'neutral',
      icon: <Target className="w-4 h-4" />,
      title: 'Optimization Opportunity',
      message: 'Based on your patterns, you could save an additional Birr 500/month by optimizing subscription costs.',
      action: 'See Details'
    },
    {
      type: 'positive',
      icon: <Award className="w-4 h-4" />,
      title: 'Goal Achievement',
      message: `You're on track to complete ${data.completedGoals} more goals this year at your current pace.`,
      action: 'View Progress'
    },
    {
      type: 'neutral',
      icon: <Activity className="w-4 h-4" />,
      title: 'Spending Pattern',
      message: 'Your spending is 15% higher on weekends. Consider setting weekend-specific budgets.',
      action: 'Create Budget'
    },
    {
      type: 'warning',
      icon: <CreditCard className="w-4 h-4" />,
      title: 'Expense Trend',
      message: 'Dining expenses have increased 25% this month. This might impact your savings goals.',
      action: 'Track Dining'
    }
  ];
}
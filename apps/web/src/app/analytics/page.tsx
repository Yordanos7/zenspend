"use client";

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Defs,
  LinearGradient
} from 'recharts';
import { monthlyTrends, categoryInfo } from '@/lib/mockData';
import { Sparkles, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function AnalyticsPage() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/90 backdrop-blur-md text-popover-foreground px-4 py-3 rounded-xl shadow-2xl border border-white/10 ring-1 ring-white/5">
          <p className="text-sm font-medium mb-3 text-muted-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm mb-1 last:mb-0">
                <div className="flex items-center gap-2">
                    <div 
                        className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                        style={{ backgroundColor: entry.color, color: entry.color }} 
                    />
                    <span className="font-medium text-foreground">{entry.name}</span>
                </div>
                <span className="font-bold tabular-nums tracking-wide">${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const categoryTrends = [
    { month: 'Aug', food: 520, transport: 380, fun: 180, shopping: 240 },
    { month: 'Sep', food: 480, transport: 350, fun: 220, shopping: 280 },
    { month: 'Oct', food: 450, transport: 320, fun: 150, shopping: 190 },
    { month: 'Nov', food: 580, transport: 340, fun: 200, shopping: 350 },
    { month: 'Dec', food: 650, transport: 400, fun: 280, shopping: 420 },
    { month: 'Jan', food: 455, transport: 320, fun: 125, shopping: 203 },
  ];

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
        {/* Background Ambient Glows */}
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] opacity-20" />
        </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Analytics & Trends
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Deep dive into your financial health.</p>
          </div>
        </motion.div>

        {/* Main Chart Section */}
        <GlassCard 
            className="p-1" 
            gradient 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="p-6 md:p-8 rounded-[14px]"> 
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                            Cash Flow
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Income vs Expenses over the last 6 months</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm bg-background/50 backdrop-blur-sm p-2 rounded-full border border-white/5">
                        <span className="flex items-center gap-2 px-2">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/40 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                            </span>
                            Income
                        </span>
                        <span className="flex items-center gap-2 px-2">
                             <span className="h-3 w-3 rounded-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                             Expenses
                        </span>
                    </div>
                </div>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.4} />
                        <XAxis 
                            dataKey="month" 
                            stroke="var(--muted-foreground)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={15}
                            fontWeight={500}
                        />
                        <YAxis 
                            stroke="var(--muted-foreground)" 
                            fontSize={12} 
                            tickFormatter={(v) => `$${v / 1000}k`} 
                            tickLine={false} 
                            axisLine={false}
                            dx={-10}
                            fontWeight={500}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            name="Expenses"
                            stroke="var(--destructive)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpenses)"
                            activeDot={{ r: 6, strokeWidth: 0, className: "animate-pulse" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            name="Income"
                            stroke="var(--success)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            activeDot={{ r: 6, strokeWidth: 0, className: "animate-pulse" }}
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Net Stats */}
            <GlassCard 
                className="p-6 md:p-8 flex flex-col justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                 <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Monthly Net</h3>
                    <p className="text-sm text-muted-foreground">Detailed breakdown by category</p>
                 </div>
                 
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryTrends} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.4} />
                            <XAxis 
                                dataKey="month" 
                                stroke="var(--muted-foreground)" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <Tooltip 
                                content={<CustomTooltip />} 
                                cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 8 }} 
                            />
                            <Bar dataKey="food" name="Food" fill={categoryInfo.food.color} stackId="a" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="transport" name="Transport" fill={categoryInfo.transport.color} stackId="a" />
                            <Bar dataKey="fun" name="Entertainment" fill={categoryInfo.entertainment.color} stackId="a" />
                            <Bar dataKey="shopping" name="Shopping" fill={categoryInfo.shopping.color} stackId="a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

             {/* Insights & Actions */}
             <div className="space-y-6">
                 {/* Main Insight */}
                <GlassCard 
                    className="p-6 md:p-8 bg-gradient-to-br from-success/10 to-transparent border-success/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="flex items-start gap-5">
                        <div className="p-3 rounded-xl bg-success text-success-foreground shadow-lg shadow-success/25 shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-foreground">AI Trend Insight</h3>
                                <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold uppercase tracking-wider">New</span>
                            </div>
                            <p className="text-base leading-relaxed text-muted-foreground">
                            Your transport expenses dropped consistently over the last 3 months, saving you approximately <span className="text-foreground font-semibold">$80</span> compared to your August baseline. 
                            Food spending peaked in December (holiday season) but has normalized in January.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Secondary Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard 
                        className="p-5 flex flex-col justify-center items-center text-center gap-2 hover:border-primary/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                         <div className="p-2 rounded-lg bg-primary/10 text-primary mb-1">
                             <TrendingUp className="w-5 h-5" />
                         </div>
                         <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Savings Rate</span>
                         <span className="text-2xl font-bold text-foreground">24%</span>
                    </GlassCard>
                    <GlassCard 
                        className="p-5 flex flex-col justify-center items-center text-center gap-2 hover:border-destructive/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                    >
                         <div className="p-2 rounded-lg bg-destructive/10 text-destructive mb-1">
                             <TrendingDown className="w-5 h-5" />
                         </div>
                         <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Expense</span>
                         <span className="text-2xl font-bold text-foreground">Housing</span>
                    </GlassCard>
                </div>
             </div>
        </div>
      </div>
    </main>
  );
};

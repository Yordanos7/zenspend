"use client";

import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { monthlyTrends, categoryInfo } from '@/lib/mockData';
import { Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground px-4 py-3 rounded-xl shadow-xl border border-border">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="font-semibold">${entry.value.toLocaleString()}</span>
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Trends</h1>
          <p className="text-muted-foreground mt-1">Long-term understanding of your finances</p>
        </motion.div>

        {/* Monthly Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-base font-semibold text-foreground">6-Month Spending Trend</h3>
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" />Income</span> 
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-destructive" />Expenses</span> 
             </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickFormatter={(v) => `$${v / 1000}k`} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="var(--destructive)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--background)', stroke: 'var(--destructive)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="var(--success)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--background)', stroke: 'var(--success)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Income vs Expenses Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
            >
                <h3 className="text-base font-semibold text-foreground mb-6">Income vs Expenses</h3>
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        stroke="var(--muted-foreground)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="var(--muted-foreground)" 
                        fontSize={12} 
                        tickFormatter={(v) => `$${v / 1000}k`} 
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.3 }} />
                    <Bar
                        dataKey="income"
                        name="Income"
                        fill="var(--success)"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    <Bar
                        dataKey="expenses"
                        name="Expenses"
                        fill="var(--destructive)" // Using destructive for expenses instead of foreground for better contrast/meaning
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Category Trends */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
            >
                <h3 className="text-base font-semibold text-foreground mb-6">Category Breakdown</h3>
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        stroke="var(--muted-foreground)" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="var(--muted-foreground)" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.3 }} />
                    <Bar dataKey="food" name="Food" fill={categoryInfo.food.color} stackId="a" />
                    <Bar dataKey="transport" name="Transport" fill={categoryInfo.transport.color} stackId="a" />
                    <Bar dataKey="fun" name="Entertainment" fill={categoryInfo.entertainment.color} stackId="a" />
                    <Bar dataKey="shopping" name="Shopping" fill={categoryInfo.shopping.color} stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </motion.div>
        </div>

        {/* Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="p-6 rounded-xl border border-success/20 bg-success/5 flex items-start gap-4"
        >
          <div className="p-2 rounded-lg bg-background text-success ring-1 ring-success/20 shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-success-foreground mb-1">AI Trend Insight</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your transport expenses dropped consistently over the last 3 months, saving you approximately $80 compared to your August baseline. 
              Food spending peaked in December (holiday season) but has normalized in January.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

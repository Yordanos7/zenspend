
'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { trpc } from '@/utils/trpc';
import { ShoppingBag } from 'lucide-react';

export function CategoryDonut() {
  const { data: spendingData = [], isLoading } = trpc.transaction.getSpendingByCategory.useQuery();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-6">Spending by Category</h3>
        <div className="flex flex-col sm:flex-row items-center gap-8 justify-center h-[calc(100%-2rem)]">
          <div className="w-48 h-48 bg-muted rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-3 w-full max-w-xs">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (spendingData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-6">Spending by Category</h3>
        <div className="flex items-center justify-center h-[calc(100%-2rem)]">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No spending data yet</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const data = spendingData.map((item, index) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.amount,
    color: item.color || `hsl(${index * 45}, 70%, 60%)`,
    count: item.count,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground px-4 py-3 rounded-xl shadow-xl border border-border">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-sm font-medium">{data.name}</span>
          </div>
          <p className="text-lg font-semibold">Birr {data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{data.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-6">Spending by Category</h3>
      
      <div className="flex flex-col sm:flex-row items-center gap-8 justify-center h-[calc(100%-2rem)]">
        {/* Chart */}
        <div className="w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                cornerRadius={4}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-xs text-muted-foreground font-medium">Total Spent</span>
             <span className="text-lg font-bold">Birr {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full max-w-xs">
          {data.slice(0, 5).map((item, index) => {
             return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full ring-2 ring-transparent group-hover:ring-offset-1 transition-all"
                  style={{ backgroundColor: item.color, borderColor: item.color }}
                />
                <span className="text-sm text-foreground flex items-center gap-2">
                   {item.name}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums">Birr {item.value.toLocaleString()}</span>
            </motion.div>
          )})}
        </div>
      </div>
    </motion.div>
  );
}

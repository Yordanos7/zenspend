
'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categorySpending, categoryInfo } from '@/lib/mockData';

export function CategoryDonut() {
  const data = categorySpending.map((item) => ({
    name: categoryInfo[item.category].name,
    value: item.amount,
    color: categoryInfo[item.category].color,
    icon: categoryInfo[item.category].icon,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const Icon = data.icon;
      return (
        <div className="bg-popover text-popover-foreground px-4 py-3 rounded-xl shadow-xl border border-border">
          <div className="flex items-center gap-2 mb-1">
             <Icon className="w-4 h-4 text-muted-foreground" />
             <span className="text-sm font-medium">{data.name}</span>
          </div>
          <p className="text-lg font-semibold">${data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{data.percentage}% of total</p>
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="text-xs text-muted-foreground font-medium">Total Spent</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full max-w-xs">
          {data.slice(0, 5).map((item, index) => {
             const Icon = item.icon;
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
                   <Icon className="w-4 h-4 text-muted-foreground" />
                   {item.name}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums">${item.value.toLocaleString()}</span>
            </motion.div>
          )})}
        </div>
      </div>
    </motion.div>
  );
}

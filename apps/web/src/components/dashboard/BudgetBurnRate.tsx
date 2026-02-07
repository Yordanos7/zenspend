
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { currentMonth } from '@/lib/mockData';

export function BudgetBurnRate() {
  const { budgetUsed, dayOfMonth, daysInMonth } = currentMonth;
  const expectedUsage = Math.round((dayOfMonth / daysInMonth) * 100);
  const timeProgress = Math.round((dayOfMonth / daysInMonth) * 100);
  
  const getProgressColor = () => {
    if (budgetUsed <= expectedUsage - 10) return 'bg-success';
    if (budgetUsed <= expectedUsage + 10) return 'bg-warning';
    return 'bg-destructive';
  };

  const getStatus = () => {
    if (budgetUsed <= expectedUsage - 10) return { text: "You're on track", color: 'text-success' };
    if (budgetUsed <= expectedUsage + 10) return { text: 'Watch your spending', color: 'text-warning' };
    return { text: 'Spending is high', color: 'text-destructive' };
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Budget Burn Rate</h3>
        <span className={cn('text-sm font-medium', status.color)}>{status.text}</span>
      </div>

      {/* Budget progress */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Budget Used</span>
            <span className="font-semibold text-foreground">{budgetUsed}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsed}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className={cn('h-full rounded-full', getProgressColor())}
            />
          </div>
        </div>

        {/* Time progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Month Progress</span>
            <span className="font-medium text-muted-foreground">Day {dayOfMonth} of {daysInMonth}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${timeProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              className="h-full rounded-full bg-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Caution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Over Budget</span>
        </div>
      </div>
    </motion.div>
  );
}

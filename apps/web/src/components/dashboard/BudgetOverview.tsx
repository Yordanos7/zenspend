import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { Target, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function BudgetOverview() {
  const { data: budgets = [], isLoading } = trpc.budget.getAll.useQuery();
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Budget Overview</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
              </div>
              <div className="h-2 bg-muted rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (budgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Budget Overview</h3>
          <Link
            href="/budget"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Set up <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No budgets set up yet</p>
          <Link
            href="/budget"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Create Budget
          </Link>
        </div>
      </motion.div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const budgetsOverLimit = budgets.filter(b => b.percentage > 100);
  const budgetsNearLimit = budgets.filter(b => b.percentage > 80 && b.percentage <= 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Budget Overview</h3>
        <Link
          href="/budget"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Budget</span>
          <span className={cn(
            "text-sm font-bold",
            overallPercentage > 100 ? "text-destructive" : 
            overallPercentage > 80 ? "text-warning" : "text-success"
          )}>
            {overallPercentage}%
          </span>
        </div>
        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            className={cn(
              "h-full rounded-full",
              overallPercentage > 100 ? "bg-destructive" :
              overallPercentage > 80 ? "bg-warning" : "bg-success"
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Birr {totalSpent.toLocaleString()}</span>
          <span>Birr {totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Budget Alerts */}
      {(budgetsOverLimit.length > 0 || budgetsNearLimit.length > 0) && (
        <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">Budget Alerts</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {budgetsOverLimit.length > 0 && (
              <p className="text-destructive">
                {budgetsOverLimit.length} budget{budgetsOverLimit.length > 1 ? 's' : ''} exceeded
              </p>
            )}
            {budgetsNearLimit.length > 0 && (
              <p className="text-warning">
                {budgetsNearLimit.length} budget{budgetsNearLimit.length > 1 ? 's' : ''} near limit
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Budgets */}
      <div className="space-y-4">
        {budgets.slice(0, 4).map((budget, index) => {
          const isOverBudget = budget.percentage > 100;
          const isNearLimit = budget.percentage > 80 && budget.percentage <= 100;
          
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.category.color || '#8884d8' }}
                  />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {budget.category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isOverBudget && <AlertTriangle className="w-3 h-3 text-destructive" />}
                  <span className={cn(
                    "text-xs font-bold",
                    isOverBudget ? "text-destructive" :
                    isNearLimit ? "text-warning" : "text-success"
                  )}>
                    {budget.percentage}%
                  </span>
                </div>
              </div>
              <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 + index * 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    isOverBudget ? "bg-destructive" :
                    isNearLimit ? "bg-warning" : "bg-success"
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Birr {budget.spent.toLocaleString()}</span>
                <span>Birr {budget.limit.toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {budgets.length > 4 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="/budget"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            +{budgets.length - 4} more budgets
          </Link>
        </div>
      )}
    </motion.div>
  );
}
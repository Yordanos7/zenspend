import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { Target, Trophy, ArrowRight, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function GoalsOverview() {
  const { data: goals = [], isLoading } = trpc.goal.getAll.useQuery();
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Goals Progress</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
              </div>
              <div className="h-2 bg-muted rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Goals Progress</h3>
          <Link
            href="/goals"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No goals set yet</p>
          <Link
            href="/goals"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </Link>
        </div>
      </motion.div>
    );
  }

  const completedGoals = goals.filter(g => (g.current / g.target) >= 1);
  const activeGoals = goals.filter(g => (g.current / g.target) < 1);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Goals Progress</h3>
        <Link
          href="/goals"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className={cn(
            "text-sm font-bold",
            overallProgress >= 75 ? "text-success" : 
            overallProgress >= 50 ? "text-warning" : "text-muted-foreground"
          )}>
            {overallProgress}%
          </span>
        </div>
        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }}
            className={cn(
              "h-full rounded-full",
              overallProgress >= 75 ? "bg-success" :
              overallProgress >= 50 ? "bg-warning" : "bg-primary"
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Birr {totalSaved.toLocaleString()}</span>
          <span>Birr {totalTarget.toLocaleString()}</span>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-4 h-4 text-success" />
            <span className="text-lg font-bold text-foreground">{completedGoals.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold text-foreground">{activeGoals.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
      </div>

      {/* Top Goals */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Goals</h4>
        {activeGoals.slice(0, 3).map((goal, index) => {
          const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {goal.name}
                </span>
                <span className={cn(
                  "text-xs font-bold",
                  percentage >= 75 ? "text-success" :
                  percentage >= 50 ? "text-warning" : "text-primary"
                )}>
                  {percentage}%
                </span>
              </div>
              <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 + index * 0.1 }}
                  className={cn(
                    "h-full rounded-full",
                    percentage >= 75 ? "bg-success" :
                    percentage >= 50 ? "bg-warning" : "bg-primary"
                  )}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Birr {goal.current.toLocaleString()}</span>
                <span>Birr {goal.target.toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeGoals.length > 3 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href="/goals"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            +{activeGoals.length - 3} more goals
          </Link>
        </div>
      )}

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href="/goals"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add New Goal
        </Link>
      </div>
    </motion.div>
  );
}
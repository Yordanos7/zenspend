"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goals as initialGoals } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Target, 
  Shield, 
  Car, 
  Plane, 
  Laptop, 
  MoreHorizontal, 
  Trophy,
  TrendingUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const icons: Record<string, any> = {
  Shield,
  Car,
  Plane,
  Laptop,
  Target
};

export default function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleAddMoney = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        
        // Trigger confetti if goal reached
        if (newCurrent === goal.target && goal.current < goal.target) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const getPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Savings Goals</h1>
            <p className="text-muted-foreground mt-1">Visualize and track your financial dreams</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" />
            Create Goal
          </button>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
            {goals.map((goal, index) => {
                const Icon = icons[goal.icon] || Target;
                const percent = getPercentage(goal.current, goal.target);
                const isComplete = percent === 100;
                
                return (
                <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={cn(
                        "group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
                        isComplete ? "border-success/30 bg-success/5" : "border-border"
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn("p-3 rounded-xl transition-colors", 
                            isComplete ? "bg-success/20 text-success" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                            {isComplete ? <Trophy className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-1">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                        Target: <span className="font-medium text-foreground">${goal.target.toLocaleString()}</span>
                        {goal.deadline && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                by {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        )}
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-muted-foreground">Progress</span>
                            <span className={cn("font-bold", isComplete ? "text-success" : "text-foreground")}>
                                {percent}%
                            </span>
                        </div>
                         {/* Progress Bar Container */}
                        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                             <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    isComplete ? "bg-success" : goal.color.replace('bg-', '') === 'blue-500' ? 'bg-blue-500' : 'bg-primary'
                                )}
                                // Fallback colors if tailwind dynamic class matching fails (for safety)
                                style={{
                                    backgroundColor: isComplete ? 'var(--success)' : undefined
                                }}
                             />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>${goal.current.toLocaleString()} saved</span>
                            <span>${(goal.target - goal.current).toLocaleString()} left</span>
                        </div>
                    </div>

                    {/* Quick Add Button */}
                    {!isComplete && (
                        <div className="mt-6 pt-6 border-t border-border flex gap-2">
                            <button 
                                onClick={() => handleAddMoney(goal.id, 100)}
                                className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors group/btn"
                            >
                                + $100
                            </button>
                             <button 
                                onClick={() => handleAddMoney(goal.id, 500)}
                                className="flex-1 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors group/btn"
                            >
                                + $500
                            </button>
                        </div>
                    )}
                    
                    {/* Completion Message */}
                    {isComplete && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 pt-4 border-t border-success/20 text-center"
                        >
                            <p className="text-sm font-semibold text-success flex items-center justify-center gap-2">
                                <Trophy className="w-4 h-4" /> Goal Achieved!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
                );
            })}
            </AnimatePresence>

             {/* Add New Goal Card Placeholder */}
             <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-8 transition-all hover:border-primary/50 hover:bg-primary/5"
             >
                 <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                     <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                 </div>
                 <h3 className="font-semibold text-muted-foreground group-hover:text-foreground">Create New Goal</h3>
            </motion.button>
        </div>
      </div>
    </main>
  );
}

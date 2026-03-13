"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { 
  Plus, Target, Shield, Car, Plane, Laptop, MoreHorizontal, Trophy,
  TrendingUp, X, Calendar, DollarSign, Zap, Star, Gift,
  CheckCircle2, AlertCircle, Clock, Sparkles, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const goalIcons: Record<string, any> = {
  Shield, Car, Plane, Laptop, Target, Gift, Award
};

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: Date | null;
  color?: string | null;
  icon?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Fetch goals
  const { data: goals = [], isLoading, refetch } = trpc.goal.getAll.useQuery();
  
  // Mutations
  const updateProgress = trpc.goal.updateProgress.useMutation({
    onSuccess: (updatedGoal) => {
      const percentage = (updatedGoal.current / updatedGoal.target) * 100;
      if (percentage >= 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('🎉 Goal achieved! Congratulations!');
      } else {
        toast.success('Progress updated!');
      }
      refetch();
    },
    onError: () => toast.error('Failed to update progress'),
  });
  
  const deleteGoal = trpc.goal.delete.useMutation({
    onSuccess: () => {
      toast.success('Goal deleted successfully');
      refetch();
    },
    onError: () => toast.error('Failed to delete goal'),
  });

  const handleAddMoney = (id: string, amount: number) => {
    updateProgress.mutate({ id, amount });
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate({ id });
    }
  };

  const getPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDaysUntilDeadline = (deadline: Date | null) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (current: number, target: number, deadline: Date | null) => {
    const percentage = getPercentage(current, target);
    const daysLeft = getDaysUntilDeadline(deadline);
    
    if (percentage >= 100) return { status: 'completed', color: 'text-success', icon: Trophy };
    if (daysLeft !== null && daysLeft < 0) return { status: 'overdue', color: 'text-destructive', icon: AlertCircle };
    if (daysLeft !== null && daysLeft <= 30) return { status: 'urgent', color: 'text-warning', icon: Clock };
    if (percentage >= 75) return { status: 'on-track', color: 'text-success', icon: TrendingUp };
    return { status: 'in-progress', color: 'text-primary', icon: Target };
  };

  if (isLoading) {
    return <GoalsLoadingState />;
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Goals</h1>
            <p className="text-muted-foreground mt-1">Turn your dreams into achievable milestones</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Templates
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Goal
            </Button>
          </div>
        </motion.div>

        {/* Goals Overview Stats */}
        <GoalsOverviewStats goals={goals} />

        {/* Goal Templates Modal */}
        <AnimatePresence>
          {showTemplates && (
            <GoalTemplatesModal
              onClose={() => setShowTemplates(false)}
              onSuccess={() => {
                setShowTemplates(false);
                refetch();
              }}
            />
          )}
        </AnimatePresence>

        {/* Add Goal Form */}
        <AnimatePresence>
          {showAddForm && (
            <AddGoalForm
              onClose={() => setShowAddForm(false)}
              onSuccess={() => {
                setShowAddForm(false);
                refetch();
              }}
            />
          )}
        </AnimatePresence>

        {/* Edit Goal Modal */}
        <AnimatePresence>
          {selectedGoal && (
            <EditGoalModal
              goal={selectedGoal}
              onClose={() => setSelectedGoal(null)}
              onSuccess={() => {
                setSelectedGoal(null);
                refetch();
              }}
            />
          )}
        </AnimatePresence>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <GoalsEmptyState onCreateGoal={() => setShowAddForm(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map((goal, index) => {
                const Icon = goalIcons[goal.icon || 'Target'] || Target;
                const percentage = getPercentage(goal.current, goal.target);
                const status = getGoalStatus(goal.current, goal.target, goal.deadline);
                const daysLeft = getDaysUntilDeadline(goal.deadline);
                const isComplete = percentage >= 100;
                
                return (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    index={index}
                    Icon={Icon}
                    percentage={percentage}
                    status={status}
                    daysLeft={daysLeft}
                    isComplete={isComplete}
                    onAddMoney={handleAddMoney}
                    onEdit={() => setSelectedGoal(goal)}
                    onDelete={() => handleDeleteGoal(goal.id)}
                    isUpdating={updateProgress.isPending}
                  />
                );
              })}
            </AnimatePresence>

            {/* Add New Goal Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: goals.length * 0.05 }}
              onClick={() => setShowAddForm(true)}
              className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-8 transition-all hover:border-primary/50 hover:bg-primary/5 min-h-[300px]"
            >
              <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-muted-foreground group-hover:text-foreground mb-1">
                  Create New Goal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start saving for something special
                </p>
              </div>
            </motion.button>
          </div>
        )}

        {/* Goal Analytics */}
        {goals.length > 0 && <GoalAnalytics goals={goals} />}
      </div>
    </main>
  );
}

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

// Component: Goals Loading State
function GoalsLoadingState() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Component: Goals Empty State
function GoalsEmptyState({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Target className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No goals yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Start your financial journey by setting your first savings goal. Whether it's an emergency fund, 
        vacation, or dream purchase - every goal begins with a single step.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button onClick={onCreateGoal} size="lg" className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Your First Goal
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Browse Templates
        </Button>
      </div>
    </div>
  );
}

// Component: Goals Overview Stats
function GoalsOverviewStats({ goals }: { goals: Goal[] }) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => (g.current / g.target) >= 1).length;
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const stats = [
    {
      title: "Total Goals",
      value: totalGoals.toString(),
      subtitle: `${completedGoals} completed`,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Total Saved",
      value: `Birr ${totalSaved.toLocaleString()}`,
      subtitle: `of Birr ${totalTarget.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      subtitle: "across all goals",
      icon: TrendingUp,
      color: overallProgress >= 75 ? "text-success" : overallProgress >= 50 ? "text-warning" : "text-muted-foreground",
      bgColor: overallProgress >= 75 ? "bg-success/10" : overallProgress >= 50 ? "bg-warning/10" : "bg-muted"
    },
    {
      title: "This Month",
      value: "Birr 1,250",
      subtitle: "added to goals",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  if (totalGoals === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
              {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
            </div>
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bgColor)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Component: Goal Card
function GoalCard({
  goal,
  index,
  Icon,
  percentage,
  status,
  daysLeft,
  isComplete,
  onAddMoney,
  onEdit,
  onDelete,
  isUpdating
}: {
  goal: Goal;
  index: number;
  Icon: any;
  percentage: number;
  status: any;
  daysLeft: number | null;
  isComplete: boolean;
  onAddMoney: (id: string, amount: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  isUpdating: boolean;
}) {
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        isComplete ? "border-success/30 bg-success/5" : "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          isComplete ? "bg-success/20 text-success" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          {isComplete ? <Trophy className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full", status.color, "bg-muted")}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">{status.status.replace('-', ' ')}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Goal Info */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{goal.name}</h3>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <span>Target: <span className="font-medium text-foreground">Birr {goal.target.toLocaleString()}</span></span>
        {goal.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : 'Overdue'}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Progress</span>
          <span className={cn("font-bold", isComplete ? "text-success" : "text-foreground")}>
            {percentage}%
          </span>
        </div>
        
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete ? "bg-success" : "bg-primary"
            )}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Birr {goal.current.toLocaleString()} saved</span>
          <span>Birr {(goal.target - goal.current).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Actions */}
      {!isComplete ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddMoney(goal.id, 100)}
            disabled={isUpdating}
            className="flex-1"
          >
            + Birr 100
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddMoney(goal.id, 500)}
            disabled={isUpdating}
            className="flex-1"
          >
            + Birr 500
          </Button>
          <Button
            size="sm"
            onClick={() => onAddMoney(goal.id, 1000)}
            disabled={isUpdating}
            className="flex-1"
          >
            + Birr 1K
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 border-t border-success/20"
        >
          <div className="flex items-center justify-center gap-2 text-success">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Goal Achieved!</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Congratulations on reaching your target</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// Component: Add Goal Form
function AddGoalForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState('#3b82f6');

  const createGoal = trpc.goal.create.useMutation({
    onSuccess: () => {
      toast.success('Goal created successfully!');
      onSuccess();
    },
    onError: () => toast.error('Failed to create goal'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) {
      toast.error('Please fill in all required fields');
      return;
    }

    createGoal.mutate({
      name,
      target: parseFloat(target),
      deadline: deadline || undefined,
      icon,
      color,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 rounded-xl border border-border bg-card shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Emergency Fund, Vacation, New Car..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Target Amount (Birr) *</label>
            <input
              type="number"
              step="0.01"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Target">Target</option>
              <option value="Shield">Emergency Fund</option>
              <option value="Car">Vehicle</option>
              <option value="Plane">Travel</option>
              <option value="Laptop">Electronics</option>
              <option value="Gift">Gift</option>
              <option value="Award">Achievement</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={createGoal.isPending}
            className="flex items-center gap-2"
          >
            {createGoal.isPending ? 'Creating...' : 'Create Goal'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// Component: Goal Templates Modal
function GoalTemplatesModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const createGoal = trpc.goal.create.useMutation();

  const templates = [
    {
      name: "Emergency Fund",
      description: "3-6 months of expenses for financial security",
      target: 15000,
      icon: "Shield",
      color: "#10b981"
    },
    {
      name: "Dream Vacation",
      description: "Save for that perfect getaway",
      target: 5000,
      icon: "Plane",
      color: "#3b82f6"
    },
    {
      name: "New Car",
      description: "Down payment for your next vehicle",
      target: 25000,
      icon: "Car",
      color: "#f59e0b"
    },
    {
      name: "Home Down Payment",
      description: "20% down payment for your dream home",
      target: 50000,
      icon: "Award",
      color: "#8b5cf6"
    }
  ];

  const handleSelectTemplate = async (template: typeof templates[0]) => {
    try {
      await createGoal.mutateAsync({
        name: template.name,
        target: template.target,
        icon: template.icon,
        color: template.color,
      });
      toast.success(`${template.name} goal created!`);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Goal Templates</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const Icon = goalIcons[template.icon] || Target;
            return (
              <div
                key={template.name}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: template.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">Birr {template.target.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Component: Edit Goal Modal
function EditGoalModal({ goal, onClose, onSuccess }: { goal: Goal; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState(goal.name);
  const [target, setTarget] = useState(goal.target.toString());
  const [deadline, setDeadline] = useState(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');

  const updateGoal = trpc.goal.update.useMutation({
    onSuccess: () => {
      toast.success('Goal updated successfully!');
      onSuccess();
    },
    onError: () => toast.error('Failed to update goal'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoal.mutate({
      id: goal.id,
      name,
      target: parseFloat(target),
      deadline: deadline || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Target Amount (Birr)</label>
            <input
              type="number"
              step="0.01"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={updateGoal.isPending}
            >
              {updateGoal.isPending ? 'Updating...' : 'Update Goal'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Component: Goal Analytics
function GoalAnalytics({ goals }: { goals: Goal[] }) {
  const completedGoals = goals.filter(g => (g.current / g.target) >= 1);
  const avgProgress = goals.length > 0 ? goals.reduce((sum, g) => sum + (g.current / g.target), 0) / goals.length * 100 : 0;
  const totalMonthlyNeeded = goals
    .filter(g => g.deadline && (g.current / g.target) < 1)
    .reduce((sum, g) => {
      const daysLeft = Math.max(1, Math.ceil((new Date(g.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      const monthsLeft = Math.max(1, daysLeft / 30);
      const remaining = g.target - g.current;
      return sum + (remaining / monthsLeft);
    }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 rounded-xl border border-border bg-card shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Goal Analytics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{completedGoals.length}</p>
          <p className="text-sm text-muted-foreground">Goals Completed</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{avgProgress.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Average Progress</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-8 h-8 text-warning" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Birr {totalMonthlyNeeded.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Monthly Target</p>
        </div>
      </div>
    </motion.div>
  );
}
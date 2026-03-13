"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { 
  Plus, Edit2, Trash2, Calendar, CreditCard, AlertCircle, 
  Target, TrendingUp, TrendingDown, DollarSign, 
  Settings, Copy, RotateCcw, Zap, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Budget = {
  id: string;
  limit: number;
  spent: number;
  percentage: number;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
};

export default function BudgetPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Fetch data
  const { data: budgets = [], isLoading: budgetsLoading, refetch: refetchBudgets } = trpc.budget.getAll.useQuery();
  const { data: categories = [] } = trpc.category.getAll.useQuery();
  const { data: spendingData = [] } = trpc.transaction.getSpendingByCategory.useQuery();

  // Mutations
  const deleteBudget = trpc.budget.delete.useMutation({
    onSuccess: () => {
      toast.success('Budget deleted successfully');
      refetchBudgets();
    },
    onError: () => toast.error('Failed to delete budget'),
  });

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const budgetsOverLimit = budgets.filter(b => b.percentage > 100).length;
  const budgetsNearLimit = budgets.filter(b => b.percentage > 80 && b.percentage <= 100).length;

  const handleDeleteBudget = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget.mutate({ id });
    }
  };

  if (budgetsLoading) {
    return <BudgetLoadingState />;
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget Management</h1>
            <p className="text-muted-foreground mt-1">Control your spending with smart budget limits</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTemplate('50-30-20')}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Templates
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Budget
            </Button>
          </div>
        </motion.div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BudgetOverviewCard
            title="Total Budget"
            value={`Birr ${totalBudget.toLocaleString()}`}
            icon={Target}
            color="text-primary"
            bgColor="bg-primary/10"
          />
          <BudgetOverviewCard
            title="Total Spent"
            value={`Birr ${totalSpent.toLocaleString()}`}
            subtitle={`${overallPercentage}% of budget`}
            icon={DollarSign}
            color={overallPercentage > 100 ? "text-destructive" : "text-foreground"}
            bgColor={overallPercentage > 100 ? "bg-destructive/10" : "bg-muted"}
          />
          <BudgetOverviewCard
            title="Over Budget"
            value={budgetsOverLimit.toString()}
            subtitle="categories"
            icon={TrendingUp}
            color="text-destructive"
            bgColor="bg-destructive/10"
          />
          <BudgetOverviewCard
            title="Near Limit"
            value={budgetsNearLimit.toString()}
            subtitle="categories"
            icon={AlertCircle}
            color="text-warning"
            bgColor="bg-warning/10"
          />
        </div>

        {/* Budget Templates Modal */}
        <AnimatePresence>
          {selectedTemplate && (
            <BudgetTemplateModal
              template={selectedTemplate}
              categories={categories}
              onClose={() => setSelectedTemplate(null)}
              onApply={() => {
                setSelectedTemplate(null);
                refetchBudgets();
              }}
            />
          )}
        </AnimatePresence>

        {/* Add/Edit Budget Form */}
        <AnimatePresence>
          {(showAddForm || editingBudget) && (
            <BudgetForm
              budget={editingBudget}
              categories={categories}
              onClose={() => {
                setShowAddForm(false);
                setEditingBudget(null);
              }}
              onSuccess={() => {
                setShowAddForm(false);
                setEditingBudget(null);
                refetchBudgets();
              }}
            />
          )}
        </AnimatePresence>

        {/* Budget List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 md:p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Monthly Budgets
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-normal">
                {budgets.length} Active
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          {budgets.length === 0 ? (
            <BudgetEmptyState onAddBudget={() => setShowAddForm(true)} />
          ) : (
            <div className="space-y-6">
              {budgets.map((budget, index) => (
                <BudgetItem
                  key={budget.id}
                  budget={budget}
                  index={index}
                  onEdit={() => setEditingBudget(budget)}
                  onDelete={() => handleDeleteBudget(budget.id)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Budget Analytics */}
        <BudgetAnalytics budgets={budgets} spendingData={spendingData} />

        {/* Smart Suggestions */}
        <SmartBudgetSuggestions spendingData={spendingData} budgets={budgets} />
      </div>
    </main>
  );
}

// Component: Budget Overview Card
function BudgetOverviewCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor 
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  color: string;
  bgColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold mt-1", color)}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
      </div>
    </motion.div>
  );
}

// Component: Budget Item
function BudgetItem({ 
  budget, 
  index, 
  onEdit, 
  onDelete 
}: {
  budget: Budget;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOverBudget = budget.percentage > 100;
  const isNearLimit = budget.percentage > 80 && budget.percentage <= 100;
  const remaining = budget.limit - budget.spent;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
      className="group p-4 rounded-xl border border-border/50 hover:border-border transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: budget.category.color || '#8884d8' }}
          >
            {budget.category.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground capitalize">{budget.category.name}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span>
                <span className="font-medium text-foreground">Birr {budget.spent.toLocaleString()}</span>
                <span className="opacity-50 mx-1">/</span>
                Birr {budget.limit.toLocaleString()}
              </span>
              <span className={cn(
                "font-medium",
                remaining >= 0 ? "text-success" : "text-destructive"
              )}>
                {remaining >= 0 ? `Birr ${remaining.toLocaleString()} left` : `Birr ${Math.abs(remaining).toLocaleString()} over`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2">
              {isOverBudget && <AlertCircle className="w-4 h-4 text-destructive animate-pulse" />}
              <span className={cn(
                "text-lg font-bold",
                isOverBudget && "text-destructive",
                isNearLimit && "text-warning",
                !isOverBudget && !isNearLimit && "text-success"
              )}>
                {budget.percentage}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? 'Over budget' : isNearLimit ? 'Near limit' : 'On track'}
            </p>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
          className={cn(
            "h-full rounded-full transition-colors",
            isOverBudget && "bg-destructive",
            isNearLimit && "bg-warning",
            !isOverBudget && !isNearLimit && "bg-success"
          )}
        />
        {/* Over-budget indicator */}
        {isOverBudget && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(budget.percentage - 100, 20)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
            className="absolute top-0 left-full h-full bg-destructive/50 rounded-full"
            style={{ marginLeft: '-1px' }}
          />
        )}
      </div>
    </motion.div>
  );
}

// Component: Budget Loading State
function BudgetLoadingState() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-2xl animate-pulse"></div>
      </div>
    </main>
  );
}

// Component: Budget Empty State
function BudgetEmptyState({ onAddBudget }: { onAddBudget: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No budgets set up yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start taking control of your spending by setting up budgets for different categories.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={onAddBudget} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Your First Budget
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Use Template
        </Button>
      </div>
    </div>
  );
}

// Component: Budget Form
function BudgetForm({ 
  budget, 
  categories, 
  onClose, 
  onSuccess 
}: {
  budget: Budget | null;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [categoryId, setCategoryId] = useState(budget?.category.id || '');
  const [limit, setLimit] = useState(budget?.limit.toString() || '');

  const createBudget = trpc.budget.create.useMutation({
    onSuccess: () => {
      toast.success('Budget created successfully');
      onSuccess();
    },
    onError: () => toast.error('Failed to create budget'),
  });

  const updateBudget = trpc.budget.update.useMutation({
    onSuccess: () => {
      toast.success('Budget updated successfully');
      onSuccess();
    },
    onError: () => toast.error('Failed to update budget'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !limit) {
      toast.error('Please fill in all fields');
      return;
    }

    const limitValue = parseFloat(limit);
    if (limitValue <= 0) {
      toast.error('Budget limit must be greater than 0');
      return;
    }

    if (budget) {
      updateBudget.mutate({ id: budget.id, limit: limitValue });
    } else {
      createBudget.mutate({ categoryId, limit: limitValue });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 rounded-xl border border-border bg-card shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">
        {budget ? 'Edit Budget' : 'Create New Budget'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={!!budget}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Limit (Birr)</label>
            <input
              type="number"
              step="0.01"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={createBudget.isPending || updateBudget.isPending}
            className="flex items-center gap-2"
          >
            {(createBudget.isPending || updateBudget.isPending) ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// Component: Budget Template Modal
function BudgetTemplateModal({
  template,
  categories,
  onClose,
  onApply
}: {
  template: string;
  categories: any[];
  onClose: () => void;
  onApply: () => void;
}) {
  const [totalIncome, setTotalIncome] = useState('');
  
  const createBudget = trpc.budget.create.useMutation();

  const templates = {
    '50-30-20': {
      name: '50/30/20 Rule',
      description: '50% needs, 30% wants, 20% savings',
      allocations: [
        { category: 'housing', percentage: 25, label: 'Housing' },
        { category: 'food', percentage: 15, label: 'Food' },
        { category: 'utilities', percentage: 10, label: 'Utilities' },
        { category: 'entertainment', percentage: 15, label: 'Entertainment' },
        { category: 'shopping', percentage: 10, label: 'Shopping' },
        { category: 'transport', percentage: 5, label: 'Transport' },
      ]
    }
  };

  const currentTemplate = templates[template as keyof typeof templates];

  const handleApplyTemplate = async () => {
    if (!totalIncome) {
      toast.error('Please enter your monthly income');
      return;
    }

    const income = parseFloat(totalIncome);
    
    try {
      for (const allocation of currentTemplate.allocations) {
        const category = categories.find(c => c.name === allocation.category);
        if (category) {
          const limit = (income * allocation.percentage) / 100;
          await createBudget.mutateAsync({
            categoryId: category.id,
            limit
          });
        }
      }
      toast.success('Budget template applied successfully');
      onApply();
    } catch (error) {
      toast.error('Failed to apply template');
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
        className="bg-card rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{currentTemplate.name}</h3>
        <p className="text-muted-foreground mb-6">{currentTemplate.description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Income (Birr)</label>
            <input
              type="number"
              value={totalIncome}
              onChange={(e) => setTotalIncome(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your monthly income"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Budget Allocation:</p>
            {currentTemplate.allocations.map((allocation) => (
              <div key={allocation.category} className="flex justify-between text-sm">
                <span className="capitalize">{allocation.label}</span>
                <span>{allocation.percentage}% = Birr {totalIncome ? ((parseFloat(totalIncome) * allocation.percentage) / 100).toLocaleString() : '0'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleApplyTemplate} disabled={!totalIncome || createBudget.isPending}>
            {createBudget.isPending ? 'Applying...' : 'Apply Template'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Component: Budget Analytics
function BudgetAnalytics({ budgets, spendingData }: { budgets: Budget[]; spendingData: any[] }) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const avgPerformance = budgets.length > 0 ? budgets.reduce((sum, b) => sum + b.percentage, 0) / budgets.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 rounded-xl border border-border bg-card shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-6">Budget Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{avgPerformance.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Average Usage</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {budgets.filter(b => b.percentage <= 80).length}
          </p>
          <p className="text-sm text-muted-foreground">On Track</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-8 h-8 text-warning" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Birr {(totalBudget - totalSpent).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Remaining</p>
        </div>
      </div>
    </motion.div>
  );
}

// Component: Smart Budget Suggestions
function SmartBudgetSuggestions({ spendingData, budgets }: { spendingData: any[]; budgets: Budget[] }) {
  const suggestions = [];

  // Generate smart suggestions based on spending patterns
  spendingData.forEach(spending => {
    const existingBudget = budgets.find(b => b.category.name === spending.category);
    if (!existingBudget && spending.amount > 100) {
      suggestions.push({
        type: 'create',
        category: spending.category,
        amount: spending.amount,
        suggestion: `Consider setting a budget for ${spending.category}. You spent Birr ${spending.amount.toLocaleString()} last month.`
      });
    }
  });

  budgets.forEach(budget => {
    if (budget.percentage > 120) {
      suggestions.push({
        type: 'increase',
        category: budget.category.name,
        amount: budget.limit,
        suggestion: `Your ${budget.category.name} budget might be too low. Consider increasing it by 20%.`
      });
    }
  });

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="p-6 rounded-xl border border-border bg-card shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Smart Suggestions
      </h3>
      
      <div className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-foreground">{suggestion.suggestion}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button size="sm" variant="outline">
                Apply
              </Button>
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
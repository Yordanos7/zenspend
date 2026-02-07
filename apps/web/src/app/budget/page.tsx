"use client";

import { motion } from 'framer-motion';
import { budgets, subscriptions, categoryInfo } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Plus, Edit2, Trash2, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function BudgetPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10 pointer-events-none">
            <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] opacity-20" />
            <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] opacity-20" />
        </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget & Subscriptions</h1>
            <p className="text-muted-foreground mt-1">Control your fixed costs and spending limits</p>
          </div>
        </motion.div>

        {/* Monthly Budget Overview */}
        <GlassCard
            gradient
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Monthly Budgets
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-normal">
                    {budgets.length} Active
                </span>
            </h3>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
              <Plus className="w-4 h-4" />
              Add Budget
            </button>
          </div>

          <div className="space-y-8">
            {budgets.map((budget, index) => {
              const category = categoryInfo[budget.category];
              const percentage = Math.round((budget.spent / budget.limit) * 100);
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage > 80 && percentage <= 100;
              const Icon = category.icon;

              return (
                <motion.div
                  key={budget.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-end justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground shrink-0 border border-white/5">
                        <Icon className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          <span className="font-medium text-foreground">${budget.spent.toLocaleString()}</span> 
                          <span className="opacity-50 mx-1">/</span> 
                          ${budget.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center gap-2">
                            {isOverBudget && <AlertCircle className="w-4 h-4 text-destructive animate-pulse" />}
                            <span
                                className={cn(
                                    'text-sm font-bold',
                                    isOverBudget && 'text-destructive',
                                    isNearLimit && 'text-warning',
                                    !isOverBudget && !isNearLimit && 'text-muted-foreground'
                                )}
                            >
                                {percentage}%
                            </span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="relative h-2.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
                      className={cn(
                        'h-full rounded-full shadow-[0_0_10px_currentColor]',
                        isOverBudget && 'bg-destructive shadow-destructive/50',
                        isNearLimit && 'bg-warning shadow-warning/50',
                        !isOverBudget && !isNearLimit && 'bg-success shadow-success/50'
                      )}
                    />
                  </div>
                  
                   {/* Edit action overlay */}
                   <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                          <Edit2 className="w-3 h-3" /> Edit Limit
                      </button>
                   </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Subscriptions */}
        <section>
             <div className="flex items-center justify-between mb-6 px-1">
                <div>
                   <h3 className="text-lg font-semibold text-foreground">Active Subscriptions</h3>
                </div>
                 <div className="text-right">
                    <p className="text-2xl font-bold tracking-tight text-foreground">
                        ${subscriptions.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub, index) => (
                <GlassCard
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="p-5 group hover:border-primary/20 transition-colors"
                >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-background to-muted flex items-center justify-center text-xl font-bold text-foreground shadow-inner border border-white/5">
                        {sub.icon}
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{sub.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                             <Calendar className="w-3 h-3" />
                             <span>{new Date(sub.nextPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="font-bold text-foreground">${sub.amount.toFixed(2)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{sub.cycle}</p>
                    </div>
                </div>
                
                 <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CreditCard className="w-3 h-3" />
                          <span>**** 4242</span>
                      </div>
                      <button className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                 </div>
                </GlassCard>
            ))}
            
             <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }} 
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[140px]"
             >
                 <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors mb-3">
                     <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                 </div>
                 <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Add Subscription</span>
             </motion.button>
            </div>
        </section>
      </div>
    </main>
  );
};

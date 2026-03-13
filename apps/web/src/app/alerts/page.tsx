"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, ArrowRight, Bell, BellOff, X, Filter, CheckCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

type AlertType = 'WARNING' | 'INFO' | 'SUCCESS';
type FilterType = 'all' | AlertType;

type Alert = {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  action?: string | null;
  isRead: boolean;
  createdAt: Date;
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  // Fetch alerts
  const { data: alerts = [], isLoading, refetch } = trpc.alert.getAll.useQuery();
  
  // Mutations
  const markAsRead = trpc.alert.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  
  const deleteAlert = trpc.alert.delete.useMutation({
    onSuccess: () => {
      toast.success('Alert dismissed');
      refetch();
    },
  });
  
  const generateBudgetAlerts = trpc.alert.generateBudgetAlerts.useMutation({
    onSuccess: (data) => {
      toast.success(`Generated ${data.alertsGenerated} new alerts`);
      refetch();
    },
  });

  const removeAlert = (id: string) => {
    deleteAlert.mutate({ id });
  };

  const markAllAsRead = () => {
    alerts.forEach(alert => {
      if (!alert.isRead) {
        markAsRead.mutate({ id: alert.id });
      }
    });
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' ? true : alert.type === filter
  );

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5" />;
      case 'INFO':
        return <Info className="w-5 h-5" />;
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'WARNING':
        return {
          card: 'border-warning/30 bg-warning/5',
          icon: 'bg-warning/20 text-warning',
        };
      case 'INFO':
        return {
          card: 'border-primary/20 bg-primary/5',
          icon: 'bg-primary/10 text-primary',
        };
      case 'SUCCESS':
        return {
          card: 'border-success/30 bg-success/5',
          icon: 'bg-success/20 text-success',
        };
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Alerts & Insights</h1>
            <p className="text-muted-foreground mt-1">AI-powered financial monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => generateBudgetAlerts.mutate()}
              disabled={generateBudgetAlerts.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {generateBudgetAlerts.isPending ? 'Generating...' : 'Check Budgets'}
            </button>
            <button 
                onClick={markAllAsRead} 
                disabled={alerts.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-input text-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              <BellOff className="w-4 h-4" />
              Settings
            </button>
          </div>
        </motion.div>

        {/* Filters & Stats */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
        >
            <button
                onClick={() => setFilter('all')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                    filter === 'all' 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                )}
            >
                All ({alerts.length})
            </button>
            <button
                onClick={() => setFilter('WARNING')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'WARNING' 
                        ? "bg-warning/10 text-warning border-warning" 
                        : "bg-background text-muted-foreground border-border hover:text-warning hover:border-warning/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-warning" />
                Warnings ({alerts.filter(a => a.type === 'WARNING').length})
            </button>
             <button
                onClick={() => setFilter('INFO')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'INFO' 
                        ? "bg-primary/10 text-primary border-primary" 
                        : "bg-background text-muted-foreground border-border hover:text-primary hover:border-primary/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-primary" />
                Insights ({alerts.filter(a => a.type === 'INFO').length})
            </button>
             <button
                onClick={() => setFilter('SUCCESS')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'SUCCESS' 
                        ? "bg-success/10 text-success border-success" 
                        : "bg-background text-muted-foreground border-border hover:text-success hover:border-success/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-success" />
                Achievements ({alerts.filter(a => a.type === 'SUCCESS').length})
            </button>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => {
                const styles = getAlertStyles(alert.type);
                return (
                <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn('relative p-5 rounded-xl border transition-colors group', styles.card, !alert.isRead && 'ring-2 ring-primary/20')}
                >
                    <button 
                        onClick={() => removeAlert(alert.id)}
                        className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-background/20 transition-colors"
                        aria-label="Dismiss alert"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4 pr-8">
                    <div className={cn('p-3 rounded-xl shrink-0', styles.icon)}>
                        {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                        <div>
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              {alert.title}
                              {!alert.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">{alert.message}</p>
                        </div>
                        
                        </div>
                         <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(alert.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                })}
                            </span>
                             {alert.action && (
                                <button 
                                  onClick={() => markAsRead.mutate({ id: alert.id })}
                                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline underline-offset-4 decoration-primary/50 transition-all"
                                >
                                    {alert.action} <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                )}
                         </div>
                    </div>
                    </div>
                </motion.div>
                );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state for when there are no alerts */}
        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-16 rounded-2xl border border-dashed border-border text-center bg-muted/5"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {filter === 'all' ? "All caught up!" : `No ${filter.toLowerCase()} alerts`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You're all caught up! Check back later for new insights." 
                : `No ${filter.toLowerCase()} alerts to show right now.`
              }
            </p>
            <button 
              onClick={() => generateBudgetAlerts.mutate()}
              disabled={generateBudgetAlerts.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {generateBudgetAlerts.isPending ? 'Checking...' : 'Check for Budget Alerts'}
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
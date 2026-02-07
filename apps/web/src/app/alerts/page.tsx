"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alerts as initialAlerts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, ArrowRight, Bell, BellOff, X, Filter, CheckCheck } from 'lucide-react';

type AlertType = 'warning' | 'info' | 'success';
type FilterType = 'all' | AlertType;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<FilterType>('all');

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts([]);
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' ? true : alert.type === filter
  );

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'warning':
        return {
          card: 'border-warning/30 bg-warning/5',
          icon: 'bg-warning/20 text-warning',
        };
      case 'info':
        return {
          card: 'border-primary/20 bg-primary/5',
          icon: 'bg-primary/10 text-primary',
        };
      case 'success':
        return {
          card: 'border-success/30 bg-success/5',
          icon: 'bg-success/20 text-success',
        };
    }
  };

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
                onClick={() => setFilter('warning')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'warning' 
                        ? "bg-warning/10 text-warning border-warning" 
                        : "bg-background text-muted-foreground border-border hover:text-warning hover:border-warning/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-warning" />
                Warnings ({alerts.filter(a => a.type === 'warning').length})
            </button>
             <button
                onClick={() => setFilter('info')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'info' 
                        ? "bg-primary/10 text-primary border-primary" 
                        : "bg-background text-muted-foreground border-border hover:text-primary hover:border-primary/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-primary" />
                Insights ({alerts.filter(a => a.type === 'info').length})
            </button>
             <button
                onClick={() => setFilter('success')}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                    filter === 'success' 
                        ? "bg-success/10 text-success border-success" 
                        : "bg-background text-muted-foreground border-border hover:text-success hover:border-success/50"
                )}
            >
                <div className="w-2 h-2 rounded-full bg-success" />
                Achievements ({alerts.filter(a => a.type === 'success').length})
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
                    className={cn('relative p-5 rounded-xl border transition-colors group', styles.card)}
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
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">{alert.message}</p>
                        </div>
                        
                        </div>
                         <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(alert.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                })}
                            </span>
                             {alert.action && (
                                <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline underline-offset-4 decoration-primary/50 transition-all">
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
                {filter === 'all' ? "All caught up!" : `No ${filter} alerts`}
            </h3>
            <p className="text-muted-foreground mt-1">
                {filter === 'all' 
                    ? "Great job! You have no new alerts." 
                    : `You don't have any ${filter} alerts at the moment.`}
            </p>
             {filter !== 'all' && (
                 <button 
                    onClick={() => setFilter('all')}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                 >
                     View all alerts
                 </button>
             )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

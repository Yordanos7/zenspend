"use client";

import { motion } from 'framer-motion';
import { alerts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, ArrowRight, Bell, BellOff } from 'lucide-react';

export default function AlertsPage() {
  const getAlertIcon = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: 'warning' | 'info' | 'success') => {
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
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Alerts & Insights</h1>
            <p className="text-muted-foreground mt-1">AI-powered financial monitoring</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
            <BellOff className="w-4 h-4" />
            Manage Alerts
          </button>
        </motion.div>

        {/* Alert Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10 text-warning mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold">{alerts.filter(a => a.type === 'warning').length}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
              <Info className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold">{alerts.filter(a => a.type === 'info').length}</p>
            <p className="text-sm text-muted-foreground">Insights</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 text-success mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold">{alerts.filter(a => a.type === 'success').length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const styles = getAlertStyles(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className={cn('p-5 rounded-xl border transition-colors', styles.card)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-3 rounded-xl shrink-0', styles.icon)}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xl">{alert.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 mt-1 sm:mt-0">
                        {new Date(alert.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {alert.action && (
                      <button className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        {alert.action} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state for when there are no alerts */}
        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 rounded-2xl border border-dashed border-border text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-foreground">All caught up!</h3>
            <p className="text-muted-foreground mt-1">No new alerts or insights at the moment.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

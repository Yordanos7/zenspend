"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import {
  Bot, Zap, Receipt, Target, Bell, Settings, Activity,
  CheckCircle2, AlertCircle, Clock, TrendingUp, Sparkles,
  Mail, Smartphone, MessageSquare, Toggle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AutomationPage() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch automation data
  const { data: healthCheck, isLoading: healthLoading } = trpc.automation.healthCheck.useQuery();
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = trpc.automation.getSettings.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.automation.getStats.useQuery();

  // Mutations
  const updateSettings = trpc.automation.updateSettings.useMutation({
    onSuccess: () => {
      toast.success('Automation settings updated successfully');
      refetchSettings();
      setIsUpdating(false);
    },
    onError: () => {
      toast.error('Failed to update automation settings');
      setIsUpdating(false);
    },
  });

  const triggerBudgetMonitoring = trpc.automation.triggerBudgetMonitoring.useMutation({
    onSuccess: () => {
      toast.success('Budget monitoring triggered successfully');
    },
    onError: () => {
      toast.error('Failed to trigger budget monitoring');
    },
  });

  const handleSettingToggle = async (setting: string, value: boolean) => {
    setIsUpdating(true);
    await updateSettings.mutateAsync({
      [setting]: value,
    });
  };

  const handleNotificationToggle = async (type: 'email' | 'push' | 'sms', value: boolean) => {
    setIsUpdating(true);
    await updateSettings.mutateAsync({
      notificationPreferences: {
        ...settings?.notificationPreferences,
        [type]: value,
      },
    });
  };

  if (healthLoading || settingsLoading || statsLoading) {
    return <AutomationLoadingState />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                  Automation Center
                </h1>
                <p className="text-muted-foreground text-lg">AI-powered financial automation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
              healthCheck?.n8nConnected 
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                healthCheck?.n8nConnected ? "bg-emerald-500" : "bg-red-500"
              )} />
              {healthCheck?.n8nConnected ? 'Connected' : 'Disconnected'}
            </div>
            <Button
              onClick={() => triggerBudgetMonitoring.mutate()}
              disabled={triggerBudgetMonitoring.isPending}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", triggerBudgetMonitoring.isPending && "animate-spin")} />
              Run Budget Check
            </Button>
          </div>
        </motion.div>

        {/* Automation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AutomationStatCard
            title="Active Workflows"
            value={stats?.activeWorkflows?.toString() || '0'}
            subtitle="automation processes"
            icon={<Activity className="w-6 h-6" />}
            color="blue"
          />
          <AutomationStatCard
            title="Transactions Processed"
            value={stats?.transactionsProcessed?.toString() || '0'}
            subtitle="auto-categorized"
            icon={<Zap className="w-6 h-6" />}
            color="green"
          />
          <AutomationStatCard
            title="Receipts Processed"
            value={stats?.receiptsProcessed?.toString() || '0'}
            subtitle="OCR extractions"
            icon={<Receipt className="w-6 h-6" />}
            color="purple"
          />
          <AutomationStatCard
            title="Time Saved"
            value={`${stats?.automationSavings || 0}m`}
            subtitle="this month"
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Automation Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Automation Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Automation Settings</h3>
            </div>

            <div className="space-y-6">
              <AutomationToggle
                title="Auto-Categorization"
                description="Automatically categorize transactions using AI"
                icon={<Sparkles className="w-5 h-5" />}
                enabled={settings?.autoCategorization || false}
                onToggle={(value) => handleSettingToggle('autoCategorization', value)}
                disabled={isUpdating}
              />

              <AutomationToggle
                title="Budget Monitoring"
                description="Monitor spending limits and send alerts"
                icon={<Target className="w-5 h-5" />}
                enabled={settings?.budgetMonitoring || false}
                onToggle={(value) => handleSettingToggle('budgetMonitoring', value)}
                disabled={isUpdating}
              />

              <AutomationToggle
                title="Receipt Processing"
                description="Extract transaction data from receipt images"
                icon={<Receipt className="w-5 h-5" />}
                enabled={settings?.receiptProcessing || false}
                onToggle={(value) => handleSettingToggle('receiptProcessing', value)}
                disabled={isUpdating}
              />
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Notification Preferences</h3>
            </div>

            <div className="space-y-6">
              <AutomationToggle
                title="Email Notifications"
                description="Receive alerts and reports via email"
                icon={<Mail className="w-5 h-5" />}
                enabled={settings?.notificationPreferences?.email || false}
                onToggle={(value) => handleNotificationToggle('email', value)}
                disabled={isUpdating}
              />

              <AutomationToggle
                title="Push Notifications"
                description="Get instant alerts on your device"
                icon={<Smartphone className="w-5 h-5" />}
                enabled={settings?.notificationPreferences?.push || false}
                onToggle={(value) => handleNotificationToggle('push', value)}
                disabled={isUpdating}
              />

              <AutomationToggle
                title="SMS Notifications"
                description="Receive critical alerts via text message"
                icon={<MessageSquare className="w-5 h-5" />}
                enabled={settings?.notificationPreferences?.sms || false}
                onToggle={(value) => handleNotificationToggle('sms', value)}
                disabled={isUpdating}
              />
            </div>
          </motion.div>
        </div>

        {/* Workflow Status */}
        <WorkflowStatus healthCheck={healthCheck} stats={stats} />
      </div>
    </main>
  );
}

// Component: Automation Loading State
function AutomationLoadingState() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded w-96 mb-4"></div>
          <div className="h-6 bg-muted rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Component: Automation Stat Card
function AutomationStatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
    green: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800',
    orange: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('p-6 rounded-3xl border shadow-sm bg-gradient-to-br', colorClasses[color])}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-2xl', iconColors[color])}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  );
}

// Component: Automation Toggle
function AutomationToggle({ title, description, icon, enabled, onToggle, disabled }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <button
            onClick={() => onToggle(!enabled)}
            disabled={disabled}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50",
              enabled ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                enabled ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Component: Workflow Status
function WorkflowStatus({ healthCheck, stats }: { healthCheck: any; stats: any }) {
  const workflows = [
    {
      name: 'Transaction Categorization',
      status: healthCheck?.n8nConnected ? 'active' : 'inactive',
      description: 'Automatically categorizes transactions using AI',
      lastRun: '2 minutes ago',
    },
    {
      name: 'Budget Monitoring',
      status: healthCheck?.n8nConnected ? 'active' : 'inactive',
      description: 'Monitors spending limits and generates alerts',
      lastRun: '1 hour ago',
    },
    {
      name: 'Receipt Processing',
      status: healthCheck?.n8nConnected ? 'active' : 'inactive',
      description: 'Extracts transaction data from receipt images',
      lastRun: '30 minutes ago',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Workflow Status</h3>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-3 h-3 rounded-full",
                workflow.status === 'active' ? "bg-emerald-500" : "bg-red-500"
              )} />
              <div>
                <h4 className="font-semibold text-foreground">{workflow.name}</h4>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-medium capitalize",
                workflow.status === 'active' ? "text-emerald-600" : "text-red-600"
              )}>
                {workflow.status}
              </p>
              <p className="text-xs text-muted-foreground">{workflow.lastRun}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
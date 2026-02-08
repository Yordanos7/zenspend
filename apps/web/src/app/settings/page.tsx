"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Globe, 
  Wallet, 
  Download, 
  MessageCircle, 
  Shield, 
  Bell,
  ChevronRight,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReport: true,
    unusualSpending: true,
    billReminders: false,
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your ZenSpend experience</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Profile</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground">Alex Johnson</h4>
              <p className="text-sm text-muted-foreground">alex@example.com</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Currency Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Currency Preference</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currencies.map((cur) => (
              <button
                key={cur.code}
                onClick={() => setCurrency(cur.code)}
                className={cn(
                  'p-4 rounded-xl border transition-all text-left relative overflow-hidden',
                  currency === cur.code
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                    : 'border-border hover:border-accent/50 hover:bg-muted/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-semibold text-foreground">{cur.symbol}</span>
                  {currency === cur.code && (
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <Check className="w-3 h-3 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground">{cur.code}</p>
                <p className="text-xs text-muted-foreground">{cur.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notifications</h3>
          </div>
          <div className="space-y-6">
            {Object.entries(notifications).map(([key, value]) => {
              const labels: Record<string, { title: string; desc: string }> = {
                budgetAlerts: { title: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
                weeklyReport: { title: 'Weekly Report', desc: 'Receive a summary every Sunday' },
                unusualSpending: { title: 'Unusual Spending', desc: 'Alert for suspicious or high transactions' },
                billReminders: { title: 'Bill Reminders', desc: 'Get reminded before subscription renewals' },
              };
              const label = labels[key];
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{label.title}</p>
                    <p className="text-sm text-muted-foreground">{label.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    className={cn(
                      'w-12 h-7 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      value ? 'bg-primary' : 'bg-input'
                    )}
                  >
                    <motion.div
                      animate={{ x: value ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-background shadow-sm absolute top-1"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Data Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data Export</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Download your financial data for backup or analysis in external tools.
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Export as CSV
            </button>
            <button className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors border border-transparent hover:border-border">
              Export as PDF
            </button>
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Integrations</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group bg-background">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                  <span className="text-xl">✈️</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Telegram</p>
                  <p className="text-sm text-muted-foreground">Log expenses via chat</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Not connected</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group bg-background">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <span className="text-xl">🏦</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Bank Connection</p>
                  <p className="text-sm text-muted-foreground">Auto-import transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Coming soon</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="p-6 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Security</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group bg-background">
              <div>
                <p className="font-medium text-left text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group bg-background">
              <div>
                <p className="font-medium text-left text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">Enabled</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

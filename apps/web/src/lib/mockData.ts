
import { 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Activity, 
  Zap,
  Coffee,
  Smartphone
} from 'lucide-react';

export const currentMonth = {
  budgetUsed: 65,
  dayOfMonth: new Date().getDate(),
  daysInMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
};

export const categoryInfo: Record<string, { name: string; color: string; icon: any }> = {
  shopping: { name: 'Shopping', color: 'var(--chart-1)', icon: ShoppingBag },
  food: { name: 'Food & Dining', color: 'var(--chart-2)', icon: Utensils },
  transport: { name: 'Transport', color: 'var(--chart-3)', icon: Car },
  housing: { name: 'Housing', color: 'var(--chart-4)', icon: Home },
  health: { name: 'Health', color: 'var(--chart-5)', icon: Activity },
  utilities: { name: 'Utilities', color: '#8884d8', icon: Zap },
  entertainment: { name: 'Entertainment', color: '#82ca9d', icon: Coffee },
  electronics: { name: 'Electronics', color: '#ffc658', icon: Smartphone },
  misc: { name: 'Miscellaneous', color: '#cbd5e1', icon: ShoppingBag }, // Fallback icon
  income: { name: 'Income', color: 'var(--success)', icon: Zap }, // Using Zap for now
};

export type Category = keyof typeof categoryInfo;

export const categorySpending = [
  { category: 'housing', amount: 1200, percentage: 40 },
  { category: 'food', amount: 600, percentage: 20 },
  { category: 'transport', amount: 300, percentage: 10 },
  { category: 'shopping', amount: 450, percentage: 15 },
  { category: 'health', amount: 150, percentage: 5 },
  { category: 'utilities', amount: 300, percentage: 10 },
];

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export const transactions: Transaction[] = [
  { id: '1', description: 'Grocery Store', amount: -85.50, date: '2023-10-25', category: 'food' },
  { id: '2', description: 'Uber Ride', amount: -15.20, date: '2023-10-24', category: 'transport' },
  { id: '3', description: 'Netflix Subscription', amount: -14.99, date: '2023-10-23', category: 'entertainment' },
  { id: '4', description: 'Salary Deposit', amount: 3500.00, date: '2023-10-20', category: 'utilities' }, // Using utilities for income just for icon
  { id: '5', description: 'Gas Station', amount: -45.00, date: '2023-10-19', category: 'transport' },
  { id: '6', description: 'Amazon Purchase', amount: -120.00, date: '2023-10-18', category: 'shopping' },
];

export const monthlyTrends = [
  { month: 'Aug', income: 4200, expenses: 2800 },
  { month: 'Sep', income: 4500, expenses: 3100 },
  { month: 'Oct', income: 4300, expenses: 2950 },
  { month: 'Nov', income: 5100, expenses: 3500 },
  { month: 'Dec', income: 4800, expenses: 4100 },
  { month: 'Jan', income: 4600, expenses: 2600 },
  { month: 'Jan', income: 4600, expenses: 2600 },
];

export const budgets = [
  { category: 'food' as Category, limit: 600, spent: 450 },
  { category: 'transport' as Category, limit: 400, spent: 380 },
  { category: 'entertainment' as Category, limit: 300, spent: 150 },
  { category: 'shopping' as Category, limit: 500, spent: 520 }, // Over budget
];

export const subscriptions = [
  { id: '1', name: 'Netflix', amount: 15.99, nextPayment: '2023-11-23', cycle: 'monthly', icon: 'N' }, // Simple icon for now
  { id: '2', name: 'Spotify', amount: 9.99, nextPayment: '2023-11-25', cycle: 'monthly', icon: 'S' },
  { id: '3', name: 'Adobe C.C.', amount: 54.99, nextPayment: '2023-11-15', cycle: 'monthly', icon: 'A' },
  { id: '4', name: 'Amazon Prime', amount: 139.00, nextPayment: '2024-02-12', cycle: 'yearly', icon: 'P' },
];

export const alerts = [
  { id: '1', type: 'warning' as const, title: 'Unusual Spending', message: 'You spent $120 on Shopping, which is 50% higher than usual.', date: '2023-10-25', action: 'View Transaction' },
  { id: '2', type: 'info' as const, title: 'Bill Reminder', message: 'Netflix subscription payment of $15.99 is due tomorrow.', date: '2023-10-22', action: 'Pay Now' },
  { id: '3', type: 'success' as const, title: 'Budget Goal Met', message: 'Congratulations! You stayed under your Food budget for 3 months in a row.', date: '2023-10-20' },
  { id: '4', type: 'info' as const, title: 'New Feature', message: 'Check out the new Analytics page to see your spending trends.', date: '2023-10-18', action: 'Try it out' },
];

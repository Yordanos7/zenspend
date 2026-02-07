
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

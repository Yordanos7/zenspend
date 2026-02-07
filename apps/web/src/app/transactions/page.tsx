"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import { transactions, categoryInfo, Transaction, Category } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Use keys from categoryInfo to ensure consistency
  const categories: (Category | 'all')[] = ['all', ...Object.keys(categoryInfo) as Category[]];

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Your complete financial memory</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-4 rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background/50 hover:bg-background focus:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                className="h-10 pl-10 pr-8 rounded-lg border border-input bg-background/50 hover:bg-background focus:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-w-[160px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : categoryInfo[cat].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range - Mock Button */}
            <button className="h-10 px-4 rounded-lg border border-input bg-background/50 hover:bg-background transition-colors flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>This Month</span>
            </button>

            {/* Export */}
            <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            <div className="col-span-1">Type</div>
            <div className="col-span-4 md:col-span-5">Description</div>
            <div className="col-span-3 hidden md:block">Category</div>
            <div className="col-span-4 md:col-span-2">Date</div>
            <div className="col-span-3 md:col-span-1 text-right">Amount</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((tx, index) => (
              <TransactionRow key={tx.id} transaction={tx} index={index} />
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                 <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No transactions found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

function TransactionRow({ transaction, index }: { transaction: Transaction; index: number }) {
  const category = categoryInfo[transaction.category];
  const isPositive = transaction.amount > 0;
  const Icon = category?.icon || Calendar; // Fallback icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors cursor-pointer group"
      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
    >
      <div className="col-span-1 flex items-center">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-background transition-colors border border-transparent group-hover:border-border"
          style={{ color: category?.color }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="col-span-4 md:col-span-5 flex items-center">
        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{transaction.description}</span>
      </div>
      <div className="col-span-3 hidden md:flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category?.color }}
        />
        <span className="text-sm text-muted-foreground">{category?.name}</span>
      </div>
      <div className="col-span-4 md:col-span-2 flex items-center text-sm text-muted-foreground">
        {new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
      <div className="col-span-3 md:col-span-1 flex items-center justify-end">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            isPositive ? 'text-success' : 'text-foreground'
          )}
        >
          {isPositive ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
      </div>
    </motion.div>
  );
}

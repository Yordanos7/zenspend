"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { ReceiptUploader } from '@/components/dashboard/ReceiptUploader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch data using tRPC
  const { data: transactions = [], isLoading: transactionsLoading, refetch: refetchTransactions } = trpc.transaction.getAll.useQuery();
  const { data: categories = [] } = trpc.category.getAll.useQuery();
  const deleteTransaction = trpc.transaction.delete.useMutation({
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      refetchTransactions();
    },
    onError: (error) => {
      toast.error('Failed to delete transaction');
    },
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tx.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction.mutate({ id });
    }
  };

  if (transactionsLoading) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
            <p className="text-muted-foreground mt-1">Your complete financial memory</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </motion.div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <AddTransactionForm 
            categories={categories} 
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              refetchTransactions();
            }}
          />
        )}

        {/* Receipt Uploader */}
        <ReceiptUploader />

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
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 pl-10 pr-8 rounded-lg border border-input bg-background/50 hover:bg-background focus:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
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
            <div className="col-span-4 md:col-span-4">Description</div>
            <div className="col-span-3 hidden md:block">Category</div>
            <div className="col-span-3 md:col-span-2">Date</div>
            <div className="col-span-2 md:col-span-1 text-right">Amount</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((tx, index) => (
              <TransactionRow 
                key={tx.id} 
                transaction={tx} 
                index={index} 
                onDelete={() => handleDeleteTransaction(tx.id)}
              />
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

function TransactionRow({ transaction, index, onDelete }: { 
  transaction: Transaction; 
  index: number;
  onDelete: () => void;
}) {
  const isPositive = transaction.amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors group"
      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
    >
      <div className="col-span-1 flex items-center">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-background transition-colors border border-transparent group-hover:border-border"
          style={{ backgroundColor: transaction.category.color || '#8884d8' }}
        >
          <span className="text-white text-xs font-bold">
            {transaction.category.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="col-span-4 md:col-span-4 flex items-center">
        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {transaction.description}
        </span>
      </div>
      <div className="col-span-3 hidden md:flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: transaction.category.color || '#8884d8' }}
        />
        <span className="text-sm text-muted-foreground capitalize">
          {transaction.category.name}
        </span>
      </div>
      <div className="col-span-3 md:col-span-2 flex items-center text-sm text-muted-foreground">
        {new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
      <div className="col-span-2 md:col-span-1 flex items-center justify-end">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            isPositive ? 'text-success' : 'text-foreground'
          )}
        >
          {isPositive ? '+' : ''}Birr {Math.abs(transaction.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <button
          onClick={onDelete}
          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function AddTransactionForm({ 
  categories, 
  onClose, 
  onSuccess 
}: { 
  categories: any[]; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const createTransaction = trpc.transaction.create.useMutation({
    onSuccess: () => {
      toast.success('Transaction added successfully');
      onSuccess();
    },
    onError: (error) => {
      toast.error('Failed to add transaction');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !categoryId) {
      toast.error('Please fill in all fields');
      return;
    }

    createTransaction.mutate({
      description,
      amount: parseFloat(amount),
      categoryId,
      date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl border border-border bg-card shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount (Birr)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={createTransaction.isPending}
            className="flex items-center gap-2"
          >
            {createTransaction.isPending ? 'Adding...' : 'Add Transaction'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

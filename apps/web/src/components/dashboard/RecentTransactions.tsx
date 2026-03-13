
import { motion } from 'framer-motion';
import { trpc } from '@/utils/trpc';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

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

export function RecentTransactions() {
  const { data: transactions = [], isLoading } = trpc.transaction.getAll.useQuery();
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-muted rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <Link href="/transactions" className="text-sm text-primary hover:underline">
              Add your first transaction
            </Link>
          </div>
        ) : (
          recentTransactions.map((tx, index) => (
            <TransactionRow key={tx.id} transaction={tx} index={index} />
          ))
        )}
      </div>
    </motion.div>
  );
}

function TransactionRow({ transaction, index }: { transaction: Transaction; index: number }) {
  const isPositive = transaction.amount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
      className="flex items-center justify-between group"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-muted/80 transition-colors"
          style={{ 
             backgroundColor: transaction.category.color || '#8884d8'
          }}
        >
           <span className="text-white text-xs font-bold">
             {transaction.category.name.charAt(0).toUpperCase()}
           </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
          <p className="text-xs text-muted-foreground capitalize">{transaction.category.name}</p>
        </div>
      </div>
      <div className="text-right pl-4">
        <p
          className={cn(
            'text-sm font-semibold tabular-nums',
            isPositive ? 'text-success' : 'text-foreground'
          )}
        >
          {isPositive ? '+' : ''}Birr {Math.abs(transaction.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </motion.div>
  );
}

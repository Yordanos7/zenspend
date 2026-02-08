
import { motion } from 'framer-motion';
import { transactions, categoryInfo, type Transaction } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RecentTransactions() {
  const recentTransactions = transactions.slice(0, 5);

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
        {recentTransactions.map((tx, index) => (
          <TransactionRow key={tx.id} transaction={tx} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function TransactionRow({ transaction, index }: { transaction: Transaction; index: number }) {
  const category = categoryInfo[transaction.category];
  const isPositive = transaction.amount > 0;
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
      className="flex items-center justify-between group"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-muted group-hover:bg-muted/80 transition-colors"
          style={{ 
             backgroundColor: `color-mix(in srgb, ${category.color} 15%, transparent)`, 
             color: category.color 
          }}
        >
           <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">{category.name}</p>
        </div>
      </div>
      <div className="text-right pl-4">
        <p
          className={cn(
            'text-sm font-semibold tabular-nums',
            isPositive ? 'text-success' : 'text-foreground'
          )}
        >
          {isPositive ? '+' : ''}Birr {transaction.amount.toLocaleString('en-US', {
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

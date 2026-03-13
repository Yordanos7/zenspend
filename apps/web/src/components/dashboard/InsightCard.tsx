import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: string;
  type?: 'neutral' | 'positive' | 'warning';
  className?: string;
}

export function InsightCard({ insight, type = 'neutral', className }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn(
        'p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 group',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-3 rounded-xl shrink-0 transition-all duration-200 group-hover:scale-105',
          getIconBg(),
          getIconColor()
        )}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AI Insight
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground font-medium">
            {insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

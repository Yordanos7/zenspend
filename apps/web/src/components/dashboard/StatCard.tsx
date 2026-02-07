import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'primary';
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card text-card-foreground',
    success: 'bg-success/10 border-success/20 text-success-foreground',
    warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
    primary: 'bg-primary/5 border-primary/10 text-primary-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('p-6 rounded-2xl border border-border shadow-sm', variantStyles[variant], className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 tracking-tight text-foreground">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
              {trend === 'neutral' && <Minus className="w-4 h-4 text-muted-foreground" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-destructive',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-muted/50 text-foreground">{icon}</div>
        )}
      </div>
    </motion.div>
  );
}

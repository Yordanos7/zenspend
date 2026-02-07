
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface InsightCardProps {
  insight: string;
  type?: 'neutral' | 'positive' | 'warning';
}

export function InsightCard({ insight, type = 'neutral' }: InsightCardProps) {
  const bgStyles = {
    neutral: 'bg-muted/30 border-muted/50 text-foreground',
    positive: 'bg-success/5 border-success/10 text-foreground',
    warning: 'bg-warning/5 border-warning/10 text-foreground',
  };

  const iconStyles = {
    neutral: 'text-primary bg-primary/10',
    positive: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={`p-4 rounded-xl border ${bgStyles[type]} shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${iconStyles[type]}`}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">AI Insight</h3>
          <p className="text-sm leading-relaxed font-medium">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
}

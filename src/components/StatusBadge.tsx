import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'passed' | 'in_progress' | 'planned' | 'failed' | 'complete' | 'below_min' | 'above_max' | 'ok';
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  passed: { label: 'Passed', className: 'bg-success/15 text-success' },
  complete: { label: 'Complete', className: 'bg-success/15 text-success' },
  in_progress: { label: 'In Progress', className: 'bg-warning/15 text-warning' },
  planned: { label: 'Planned', className: 'bg-info/15 text-info' },
  ok: { label: 'On Track', className: 'bg-info/15 text-info' },
  failed: { label: 'Failed', className: 'bg-destructive/15 text-destructive' },
  below_min: { label: 'Below Min', className: 'bg-destructive/15 text-destructive' },
  above_max: { label: 'Over Max', className: 'bg-warning/15 text-warning' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.planned;
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </motion.span>
  );
}

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EctsProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EctsProgressBar({ value, max, label, showValue = true, size = 'md', className }: EctsProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showValue && (
            <span className="text-sm font-mono text-muted-foreground">
              {value}/{max} ECTS
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-secondary overflow-hidden', heightClass)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            pct >= 100 ? 'gradient-success' : 'bg-primary'
          )}
        />
      </div>
    </div>
  );
}

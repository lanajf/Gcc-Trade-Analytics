import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
}

const colorMap = {
  primary: 'from-primary/20 to-primary/5 border-primary/30',
  secondary: 'from-secondary/20 to-secondary/5 border-secondary/30',
  accent: 'from-accent/20 to-accent/5 border-accent/30',
  success: 'from-success/20 to-success/5 border-success/30',
  warning: 'from-warning/20 to-warning/5 border-warning/30',
  info: 'from-info/20 to-info/5 border-info/30',
};

const iconColorMap = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  accent: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  color = 'primary',
}: KPICardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
        'bg-gradient-to-br backdrop-blur-xl',
        'border border-border/50 hover:border-primary/30',
        'hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02]',
        colorMap[color],
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className={cn('p-2 rounded-xl', iconColorMap[color])}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
          {trend && trendValue && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                trend === 'up' && 'bg-success/10 text-success',
                trend === 'down' && 'bg-destructive/10 text-destructive',
                trend === 'neutral' && 'bg-muted/10 text-muted'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

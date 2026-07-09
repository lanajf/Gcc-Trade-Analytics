import { Network, Wallet, Zap, ShieldCheck, Recycle, Clock, DollarSign, CircleArrowUp as ArrowUpCircle } from 'lucide-react';
import { recommendations } from '@/data/gcc-data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  network: Network,
  wallet: Wallet,
  zap: Zap,
  'shield-check': ShieldCheck,
  recycle: Recycle,
};

const priorityColors = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-success/20 text-success border-success/30',
};

export function RecommendationsSection() {
  return (
    <section id="recommendations" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Policy Recommendations</h2>
        <p className="text-muted">Strategic recommendations to enhance trade balance through digital innovation, financial inclusion, and sustainability initiatives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const Icon = iconMap[rec.icon];
          const priorityLevel = rec.priority as keyof typeof priorityColors;

          return (
            <div
              key={rec.id}
              className="group relative glass-card p-6 transition-all duration-300 hover:border-primary/30 hover:scale-[1.02] overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-12 translate-x-12" />

              <div className="relative flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{rec.title}</h3>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border',
                      priorityColors[priorityLevel]
                    )}
                  >
                    <ArrowUpCircle className="w-3 h-3" />
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <p className="relative text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                {rec.description}
              </p>

              <div className="relative space-y-3 pt-4 border-t border-border/30">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted" />
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">Timeline</p>
                    <p className="text-sm font-medium text-foreground">{rec.timeline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted" />
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">Estimated Investment</p>
                    <p className="text-sm font-medium text-foreground">{rec.investment}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6 mt-6">
        <h3 className="font-semibold text-foreground mb-4">Implementation Roadmap</h3>
        <div className="relative">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />

          <div className="relative grid grid-cols-5 gap-4">
            {[
              { phase: 'Phase 1', year: '2024', items: 'Digital Infrastructure' },
              { phase: 'Phase 2', year: '2025', items: 'Financial Inclusion' },
              { phase: 'Phase 3', year: '2026', items: 'Sustainability Framework' },
              { phase: 'Phase 4', year: '2028', items: 'Renewable Energy' },
              { phase: 'Phase 5', year: '2030', items: 'Full Integration' },
            ].map((item, idx) => (
              <div key={item.phase} className="relative text-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-sm relative z-10',
                    'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20'
                  )}
                >
                  {idx + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{item.phase}</p>
                <p className="text-xs text-muted">{item.year}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Wifi, Landmark, Leaf, TriangleAlert as AlertTriangle, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { insights } from '@/data/gcc-data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  landmark: Landmark,
  leaf: Leaf,
  'alert-triangle': AlertTriangle,
};

export function InsightsSection() {
  return (
    <section id="insights" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Key Insights</h2>
        <p className="text-muted">Data-driven findings from our analysis of GCC trade, innovation, and sustainability factors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = iconMap[insight.icon];
          const isPositive = insight.trend === 'positive';

          return (
            <div
              key={insight.id}
              className="group relative glass-card p-6 hover:border-primary/30 transition-all duration-300 hover:scale-[1.01] overflow-hidden"
            >
              <div
                className={cn(
                  'absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 transition-opacity duration-300',
                  isPositive ? 'bg-success/10' : 'bg-destructive/10'
                )}
              />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'p-3 rounded-xl',
                      isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{insight.title}</h3>
                      <div
                        className={cn(
                          'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                          isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {insight.impact}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors group-hover:gap-2">
                    Learn more <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  'absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500',
                  isPositive ? 'bg-gradient-to-r from-success to-success/50' : 'bg-gradient-to-r from-destructive to-destructive/50'
                )}
                style={{ width: '60%' }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

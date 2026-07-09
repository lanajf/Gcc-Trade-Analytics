import { useEffect, useState } from 'react';
import { GitCompare, Info } from 'lucide-react';
import { correlationMatrix } from '@/data/gcc-data';
import { cn } from '@/lib/utils';
import { SkeletonChart } from '@/components/ui/Skeleton';

export function CorrelationMatrixSection() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    row: string;
    col: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const columns = [
    { key: 'tradeBalance', label: 'Trade Balance' },
    { key: 'internetUse', label: 'Internet Use' },
    { key: 'mobileCellular', label: 'Mobile Cellular' },
    { key: 'secureServers', label: 'Secure Servers' },
    { key: 'financialInclusion', label: 'Financial Inclusion' },
    { key: 'sustainabilityIndex', label: 'Sustainability Index' },
    { key: 'ecologicalFootprint', label: 'Ecological Footprint' },
  ] as const;

  function getCorrelationColor(value: number): string {
    if (value === 1) return 'rgba(59, 130, 246, 0.6)';
    if (value >= 0.8) return 'rgba(34, 197, 94, 0.7)';
    if (value >= 0.6) return 'rgba(34, 197, 94, 0.5)';
    if (value >= 0.4) return 'rgba(34, 197, 94, 0.3)';
    if (value >= 0.2) return 'rgba(234, 179, 8, 0.3)';
    if (value > 0) return 'rgba(234, 179, 8, 0.2)';
    if (value > -0.2) return 'rgba(239, 68, 68, 0.2)';
    if (value > -0.4) return 'rgba(239, 68, 68, 0.3)';
    if (value > -0.6) return 'rgba(239, 68, 68, 0.5)';
    return 'rgba(239, 68, 68, 0.7)';
  }

  return (
    <section id="correlation" className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Correlation Matrix</h2>
          <p className="text-muted">Inter-variable relationships across trade, innovation, financial, and sustainability indicators</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted bg-sidebar/50 px-3 py-2 rounded-lg">
          <Info className="w-4 h-4" />
          <span>Hover for details</span>
        </div>
      </div>

      <div className="chart-container overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `200px repeat(${columns.length}, 1fr)` }}>
            <div></div>
            {columns.map((col) => (
              <div key={col.key} className="text-center text-xs text-muted py-3 font-medium whitespace-nowrap">
                {col.label.split(' ').map((word, i) => (
                  <div key={i}>{word}</div>
                ))}
              </div>
            ))}

            {correlationMatrix.map((row) => (
              <div key={`row-${row.variable}`} className="contents">
                <div
                  className="flex items-center gap-2 text-sm text-foreground pr-4 py-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  {row.variable}
                </div>
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <button
                      key={`${row.variable}-${col.key}`}
                      className={cn(
                        'relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:z-10',
                        hoveredCell?.row === row.variable && hoveredCell?.col === col.label && 'ring-2 ring-primary'
                      )}
                      style={{ backgroundColor: getCorrelationColor(value) }}
                      onMouseEnter={() => setHoveredCell({ row: row.variable, col: col.label, value })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span
                        className={cn(
                          'text-xs font-medium',
                          Math.abs(value) > 0.5 ? 'text-white' : 'text-foreground'
                        )}
                      >
                        {value.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {hoveredCell && (
          <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">
                  {hoveredCell.row} vs {hoveredCell.col}
                </p>
                <p className="text-sm text-muted">
                  Correlation coefficient: <span className="font-mono text-foreground">{hoveredCell.value.toFixed(3)}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {hoveredCell.value > 0.7
                    ? 'Strong positive correlation - variables move together'
                    : hoveredCell.value > 0.4
                    ? 'Moderate positive correlation'
                    : hoveredCell.value > 0
                    ? 'Weak positive correlation'
                    : hoveredCell.value < -0.4
                    ? 'Moderate negative correlation - inverse relationship'
                    : 'Weak negative correlation'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-8 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500/70 to-green-500/30" />
            <span className="text-muted">Positive correlation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-500/30 to-yellow-500/20" />
            <span className="text-muted">Weak/No correlation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-500/70 to-red-500/30" />
            <span className="text-muted">Negative correlation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

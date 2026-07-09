import { cn } from '@/lib/utils';
import type { GCCCountry } from '@/data/gcc-data';

interface CountryCardProps {
  country: GCCCountry;
  isSelected: boolean;
  onClick: () => void;
  data: {
    tradeBalance: number;
    exports: number;
    imports: number;
  };
}

export function CountryCard({ country, isSelected, onClick, data }: CountryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full text-left rounded-2xl p-5 transition-all duration-300 overflow-hidden',
        'bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm',
        'border hover:shadow-xl hover:scale-[1.02]',
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border/50 hover:border-primary/50'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
          'bg-gradient-to-br'
        )}
        style={{ backgroundImage: `linear-gradient(to bottom right, ${country.color}, transparent)` }}
      />

      <div className="relative flex items-center gap-4 mb-4">
        <span className="text-3xl">{country.flag}</span>
        <div>
          <h3 className="font-semibold text-foreground">{country.name}</h3>
          <p className="text-xs text-muted">Click to filter data</p>
        </div>
        {isSelected && (
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}
      </div>

      <div className="relative grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-lg bg-sidebar/30">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Balance</p>
          <p className="text-sm font-semibold text-foreground">${data.tradeBalance}B</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-sidebar/30">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Exports</p>
          <p className="text-sm font-semibold text-success">${data.exports}B</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-sidebar/30">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Imports</p>
          <p className="text-sm font-semibold text-warning">${data.imports}B</p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500"
        style={{
          width: isSelected ? '100%' : '30%',
          background: `linear-gradient(to right, ${country.color}, ${country.color}80)`,
        }}
      />
    </button>
  );
}

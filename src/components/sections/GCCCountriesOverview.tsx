import { useDashboard } from '@/contexts/DashboardContext';
import { CountryCard } from '@/components/ui/CountryCard';
import { gccCountries, tradeBalance2024, exports2024, imports2024 } from '@/data/gcc-data';

export function GCCCountriesOverview() {
  const { selectedCountry, setSelectedCountry } = useDashboard();

  return (
    <section id="countries" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">GCC Countries Overview</h2>
        <p className="text-muted">Click on a country to filter all dashboard data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gccCountries.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            isSelected={selectedCountry === country.id}
            onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
            data={{
              tradeBalance: tradeBalance2024[country.id],
              exports: exports2024[country.id],
              imports: imports2024[country.id],
            }}
          />
        ))}
      </div>
    </section>
  );
}

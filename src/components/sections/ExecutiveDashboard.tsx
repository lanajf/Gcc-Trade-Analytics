import { TrendingUp, Wifi, Landmark, Leaf, BrainCircuit, ChartBar as BarChart3 } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { LineChartComponent } from '@/components/charts/LineChart';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  tradeBalanceHistorical,
  tradeBalance2024,
  digitalInnovationInternetUse,
  financialInclusionAccountOwnership,
  sustainabilityIndex,
  mlResults,
  gccCountries,
} from '@/data/gcc-data';

export function ExecutiveDashboard() {
  const { selectedCountry } = useDashboard();

  const avgTradeBalance =
    Object.values(tradeBalance2024).reduce((a, b) => a + b, 0) / gccCountries.length;

  const avgInternetUse =
    Object.values(digitalInnovationInternetUse).reduce((a, b) => a + b, 0) / gccCountries.length;

  const avgFinancialInclusion =
    Object.values(financialInclusionAccountOwnership).reduce((a, b) => a + b, 0) / gccCountries.length;

  const avgSustainability =
    Object.values(sustainabilityIndex).reduce((a, b) => a + b, 0) / gccCountries.length;

  return (
    <section id="executive" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Executive Dashboard</h2>
        <p className="text-muted">High-level overview of GCC trade, innovation, and sustainability metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Avg. Trade Balance"
          value={`$${avgTradeBalance.toFixed(1)}B`}
          subtitle="USD billions, 2024"
          icon={<TrendingUp className="w-4 h-4" />}
          trend="up"
          trendValue="+8.2%"
          color="primary"
        />
        <KPICard
          title="Internet Usage"
          value={`${avgInternetUse.toFixed(0)}%`}
          subtitle="GCC average, 2024"
          icon={<Wifi className="w-4 h-4" />}
          trend="up"
          trendValue="+3.1%"
          color="accent"
        />
        <KPICard
          title="Financial Inclusion"
          value={`${avgFinancialInclusion.toFixed(0)}%`}
          subtitle="Account ownership"
          icon={<Landmark className="w-4 h-4" />}
          trend="up"
          trendValue="+5.4%"
          color="success"
        />
        <KPICard
          title="Sustainability Index"
          value={avgSustainability.toFixed(0)}
          subtitle="Composite score (0-100)"
          icon={<Leaf className="w-4 h-4" />}
          trend="up"
          trendValue="+2.8%"
          color="secondary"
        />
        <KPICard
          title="ML Accuracy"
          value={`${mlResults.randomForest.accuracy}%`}
          subtitle="Random Forest model"
          icon={<BrainCircuit className="w-4 h-4" />}
          color="warning"
        />
        <KPICard
          title="OLS R-squared"
          value={mlResults.olsRegression.r2.toFixed(3)}
          subtitle="Regression fit"
          icon={<BarChart3 className="w-4 h-4" />}
          color="info"
        />
      </div>

      <LineChartComponent
        data={tradeBalanceHistorical}
        title="Trade Balance Trend (2010-2024)"
        selectedCountry={selectedCountry}
      />
    </section>
  );
}

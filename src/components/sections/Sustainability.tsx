import { useEffect, useState } from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Leaf, Zap, TrendingUp, ArrowDownFromLine } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  gccCountries,
  sustainabilityIndex,
  ecologicalFootprint,
  renewableEnergyShare,
  tradeData2024,
} from '@/data/gcc-data';
import { SkeletonChart } from '@/components/ui/Skeleton';

function BubbleChart({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const chartData = tradeData2024.map((item) => ({
    name: item.country,
    cx: item.sustainabilityIdx,
    cy: item.ecoFootprint,
    size: item.renewableEnergy * 20,
    color: item.color,
    renewable: item.renewableEnergy,
  }));

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            type="number"
            dataKey="cx"
            name="Sustainability Index"
            domain={[50, 80]}
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
            label={{ value: 'Sustainability Index', position: 'bottom', fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="cy"
            name="Ecological Footprint"
            domain={[6.5, 10]}
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
            label={{ value: 'Ecological Footprint', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: '#f8fafc' }}
            formatter={(value, name) => {
              const numValue = Number(value);
              if (name === 'Sustainability Index') return [numValue.toFixed(1), String(name)];
              if (name === 'Ecological Footprint') return [numValue.toFixed(1), String(name)];
              return [`${numValue.toFixed(0)}%`, 'Renewable Energy'];
            }}
          />
          <Scatter name="Countries" data={chartData} fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                r={entry.size / 3}
                style={{ transition: 'all 0.3s ease' }}
              />
            ))}
          </Scatter>
          <Scatter
            name="Legend"
            data={[]}
            fill="transparent"
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted">{item.name}: {item.renewable}% renewable</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressIndicators() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-6">Renewable Energy Targets Progress</h3>
      <div className="space-y-6">
        {gccCountries.map((country) => {
          const current = renewableEnergyShare[country.id];
          const target = 15;
          const progress = (current / target) * 100;

          return (
            <div key={country.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-foreground">{country.name}</span>
                </span>
                <span className="text-muted">
                  {current}% / {target}% target
                </span>
              </div>
              <div className="h-3 bg-sidebar-accent rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animated ? `${progress}%` : '0%',
                    backgroundColor: country.color,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Progress: {progress.toFixed(0)}%</span>
                <span className={progress >= 60 ? 'text-success' : progress >= 40 ? 'text-warning' : 'text-destructive'}>
                  {progress >= 60 ? 'On Track' : progress >= 40 ? 'Moderate' : 'Behind'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const sustainabilityHistorical = Array.from({ length: 7 }, (_, i) => {
  const year = 2018 + i;
  return {
    year,
    saudi: +(58 + i * 1.5).toFixed(0),
    uae: +(61 + i * 1.6).toFixed(0),
    qatar: +(60 + i * 1.4).toFixed(0),
    kuwait: +(55 + i * 1.2).toFixed(0),
    bahrain: +(54 + i * 1.0).toFixed(0),
    oman: +(53 + i * 1.0).toFixed(0),
  };
});

export function Sustainability() {
  const { selectedCountry } = useDashboard();

  const avgSustainability = Object.values(sustainabilityIndex).reduce((a, b) => a + b, 0) / gccCountries.length;
  const avgFootprint = Object.values(ecologicalFootprint).reduce((a, b) => a + b, 0) / gccCountries.length;
  const avgRenewable = Object.values(renewableEnergyShare).reduce((a, b) => a + b, 0) / gccCountries.length;

  const topPerformer = gccCountries.reduce((max, c) =>
    sustainabilityIndex[c.id] > sustainabilityIndex[max.id] ? c : max
  );

  return (
    <section id="sustainability" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Sustainability Metrics</h2>
        <p className="text-muted">Environmental performance and renewable energy transition progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Sustainability Index"
          value={avgSustainability.toFixed(0)}
          subtitle="GCC Average Score"
          icon={<Leaf className="w-4 h-4" />}
          trend="up"
          trendValue="+4.2%"
          color="secondary"
        />
        <KPICard
          title="Ecological Footprint"
          value={avgFootprint.toFixed(1)}
          subtitle="Global hectares per capita"
          icon={<ArrowDownFromLine className="w-4 h-4" />}
          trend="down"
          trendValue="-2.1%"
          color="warning"
        />
        <KPICard
          title="Renewable Energy"
          value={`${avgRenewable.toFixed(1)}%`}
          subtitle="Share of total energy"
          icon={<Zap className="w-4 h-4" />}
          trend="up"
          trendValue="+27.8%"
          color="accent"
        />
        <KPICard
          title="Leading Country"
          value={topPerformer.name.split(' ')[0]}
          subtitle={`Score: ${sustainabilityIndex[topPerformer.id]}`}
          icon={<TrendingUp className="w-4 h-4" />}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BubbleChart title="Sustainability vs Ecological Footprint (Bubble Size: Renewable Share)" />
        <AreaChartComponent
          data={sustainabilityHistorical}
          title="Sustainability Index Trend (2018-2024)"
          selectedCountry={selectedCountry}
        />
      </div>

      <ProgressIndicators />
    </section>
  );
}

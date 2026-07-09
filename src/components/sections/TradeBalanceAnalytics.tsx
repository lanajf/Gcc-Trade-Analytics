import { useEffect, useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { LineChartComponent } from '@/components/charts/LineChart';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { KPICard } from '@/components/ui/KPICard';
import {
  gccCountries,
  tradeData2024,
  tradeBalanceHistorical,
  exports2024,
  imports2024,
} from '@/data/gcc-data';
import { SkeletonChart } from '@/components/ui/Skeleton';

function StackedBarChart({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const chartData = tradeData2024.map((item) => ({
    country: item.country,
    flag: item.flag,
    exports: item.exports,
    imports: item.imports * -1,
  }));

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="country"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: '#f8fafc' }}
            formatter={(value, name) => [
              `$${Math.abs(Number(value)).toFixed(1)}B`,
              String(name) === 'exports' ? 'Exports' : 'Imports',
            ]}
          />
          <Legend />
          <Bar
            dataKey="exports"
            name="Exports"
            stackId="a"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="imports"
            name="Imports"
            stackId="a"
            fill="#ef4444"
            radius={[0, 0, 4, 4]}
            animationDuration={800}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TradeBalanceAnalytics() {
  const { selectedCountry } = useDashboard();

  const totalExports = Object.values(exports2024).reduce((a, b) => a + b, 0);
  const totalImports = Object.values(imports2024).reduce((a, b) => a + b, 0);
  const totalBalance = totalExports - totalImports;

  return (
    <section id="trade" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Trade Balance Analytics</h2>
        <p className="text-muted">Comprehensive analysis of GCC trade flows and balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total GCC Exports"
          value={`$${totalExports}B`}
          subtitle="USD billions, 2024"
          icon={<TrendingUp className="w-4 h-4" />}
          trend="up"
          trendValue="+12.4%"
          color="success"
        />
        <KPICard
          title="Total GCC Imports"
          value={`$${totalImports.toFixed(1)}B`}
          subtitle="USD billions, 2024"
          icon={<TrendingDown className="w-4 h-4" />}
          trend="up"
          trendValue="+9.8%"
          color="warning"
        />
        <KPICard
          title="Net Trade Balance"
          value={`$${totalBalance.toFixed(1)}B`}
          subtitle="Trade surplus"
          icon={<ArrowRightLeft className="w-4 h-4" />}
          trend="up"
          trendValue="+8.2%"
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={tradeBalanceHistorical}
          title="Trade Balance Over Time"
          selectedCountry={selectedCountry}
        />
        <StackedBarChart title="Exports vs Imports by Country" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartComponent
          data={tradeBalanceHistorical}
          title="Trade Balance Area Chart"
          selectedCountry={selectedCountry}
        />
        <CountryComparisonChart />
      </div>
    </section>
  );
}

function CountryComparisonChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const chartData = gccCountries.map((c) => ({
    name: c.name,
    flag: c.flag,
    value: tradeData2024.find((d) => d.countryCode === c.id)?.tradeBalance || 0,
    color: c.color,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">Trade Balance Comparison (2024)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            type="number"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => [`$${Number(value)}B USD`, 'Trade Balance']}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

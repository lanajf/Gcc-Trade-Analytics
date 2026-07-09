import { useEffect, useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Wifi, Smartphone, Server } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { RadarChartComponent } from '@/components/charts/RadarChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  gccCountries,
  digitalInnovationInternetUse,
  digitalInnovationMobileCellular,
  digitalInnovationSecureServers,
  internetUseHistorical,
} from '@/data/gcc-data';
import { SkeletonChart } from '@/components/ui/Skeleton';

function HeatmapChart({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const metrics = ['Internet Use', 'Mobile Cellular', 'Secure Servers'];
  const normalizedData: { metric: string; [key: string]: number | string }[] = metrics.map((metric, idx) => {
    const row: { metric: string; [key: string]: number | string } = { metric };
    gccCountries.forEach((c) => {
      let value = 0;
      if (idx === 0) value = digitalInnovationInternetUse[c.id] / 100;
      else if (idx === 1) value = digitalInnovationMobileCellular[c.id] / 200;
      else value = digitalInnovationSecureServers[c.id] / 70000;
      row[c.id] = +(value * 100).toFixed(0);
    });
    return row;
  });

  const gridData: { x: string; y: string; value: number; color: string }[] = [];
  normalizedData.forEach((row) => {
    gccCountries.forEach((c) => {
      gridData.push({
        x: c.name,
        y: row.metric,
        value: row[c.id] as number,
        color: c.color,
      });
    });
  });

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-7 gap-1 text-xs">
        <div></div>
        {gccCountries.map((c) => (
          <div key={c.id} className="text-center text-muted py-2 truncate">
            {c.flag} {c.name.split(' ')[0]}
          </div>
        ))}
        {normalizedData.map((row) => (
          <div key={row.metric} className="contents">
            <div className="py-4 text-muted-foreground text-right pr-2">
              {row.metric}
            </div>
            {gccCountries.map((c) => {
              const value = row[c.id] as number;
              const opacity = value / 100;
              return (
                <div
                  key={`${row.metric}-${c.id}`}
                  className="flex items-center justify-center py-4 rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${opacity * 0.8})`,
                  }}
                >
                  <span className="text-xs font-medium text-white/90">{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DigitalInnovation() {
  const { selectedCountry } = useDashboard();

  const avgInternet = Object.values(digitalInnovationInternetUse).reduce((a, b) => a + b, 0) / gccCountries.length;
  const avgMobile = Object.values(digitalInnovationMobileCellular).reduce((a, b) => a + b, 0) / gccCountries.length;
  const totalServers = Object.values(digitalInnovationSecureServers).reduce((a, b) => a + b, 0);

  const radarData = gccCountries.slice(0, 4).map((c) => ({
    metric: c.name.split(' ')[0],
    [c.id]: digitalInnovationInternetUse[c.id],
  }));

  return (
    <section id="digital" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Digital Innovation</h2>
        <p className="text-muted">Technology adoption and digital infrastructure metrics across GCC nations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Internet Penetration"
          value={`${avgInternet.toFixed(0)}%`}
          subtitle="GCC average"
          icon={<Wifi className="w-4 h-4" />}
          trend="up"
          trendValue="+3.2%"
          color="primary"
        />
        <KPICard
          title="Mobile Subscriptions"
          value={`${avgMobile.toFixed(0)}/100`}
          subtitle="Per 100 people"
          icon={<Smartphone className="w-4 h-4" />}
          trend="up"
          trendValue="+5.1%"
          color="secondary"
        />
        <KPICard
          title="Secure Servers"
          value={totalServers.toLocaleString()}
          subtitle="Total GCC count"
          icon={<Server className="w-4 h-4" />}
          trend="up"
          trendValue="+18.4%"
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChartComponent
          title="Digital Innovation Radar"
          data={radarData}
        />
        <InternetBarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={internetUseHistorical}
          title="Internet Usage Trend (2010-2024)"
          selectedCountry={selectedCountry}
        />
        <HeatmapChart title="Digital Innovation Heatmap" />
      </div>
    </section>
  );
}

function InternetBarChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const chartData = gccCountries.map((c) => ({
    name: c.name.split(' ')[0],
    flag: c.flag,
    internet: digitalInnovationInternetUse[c.id],
    color: c.color,
  })).sort((a, b) => b.internet - a.internet);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">Internet Usage by Country (2024)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
          />
          <YAxis
            domain={[0, 100]}
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
            formatter={(value) => [`${Number(value)}%`, 'Internet Usage']}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Bar dataKey="internet" radius={[4, 4, 0, 0]} animationDuration={800}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

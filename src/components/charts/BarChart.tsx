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
import { SkeletonChart } from '@/components/ui/Skeleton';
import { gccCountries } from '@/data/gcc-data';

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  title: string;
  horizontal?: boolean;
}

export function BarChartComponent({ data, title, horizontal = false }: BarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <SkeletonChart />;
  }

  const chartData = data.map((item) => {
    const country = gccCountries.find((c) => c.name === item.name || c.id === item.name);
    return {
      ...item,
      color: item.color || country?.color || '#3b82f6',
    };
  });

  const Chart = horizontal ? RechartsBarChart : RechartsBarChart;
  const XAxisComponent = horizontal ? YAxis : XAxis;
  const YAxisComponent = horizontal ? XAxis : YAxis;

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <Chart data={chartData} layout={horizontal ? 'vertical' : 'horizontal'}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxisComponent
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            type={horizontal ? 'category' : 'number'}
            axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
          />
          <YAxisComponent
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
            type={horizontal ? 'number' : 'category'}
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
            itemStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} animationDuration={800}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

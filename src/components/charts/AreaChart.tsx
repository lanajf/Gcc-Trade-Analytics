import { useEffect, useState } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { gccCountries } from '@/data/gcc-data';

interface AreaChartProps {
  data: { year: number; [key: string]: number | string }[];
  title: string;
  dataKeys?: string[];
  selectedCountry?: string | null;
}

const colors = gccCountries.map((c) => c.color);

export function AreaChartComponent({
  data,
  title,
  dataKeys,
  selectedCountry,
}: AreaChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <SkeletonChart />;
  }

  const keys = dataKeys || gccCountries.map((c) => c.id);
  const filteredKeys = selectedCountry ? [selectedCountry] : keys;

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {filteredKeys.map((key, idx) => {
              const country = gccCountries.find((c) => c.id === key);
              const color = country?.color || colors[idx % colors.length];
              return (
                <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
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
            itemStyle={{ color: '#94a3b8' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const country = gccCountries.find((c) => c.id === value);
              return country ? `${country.flag} ${country.name}` : value;
            }}
          />
          {filteredKeys.map((key, idx) => {
            const country = gccCountries.find((c) => c.id === key);
            const color = country?.color || colors[idx % colors.length];
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                fill={`url(#area-${key})`}
                strokeWidth={2}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

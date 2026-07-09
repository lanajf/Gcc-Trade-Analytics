import { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { gccCountries } from '@/data/gcc-data';

interface LineChartProps {
  data: { year: number; [key: string]: number | string }[];
  title: string;
  dataKeys?: string[];
  selectedCountry?: string | null;
}

const colors = gccCountries.map((c) => c.color);

export function LineChartComponent({
  data,
  title,
  dataKeys,
  selectedCountry,
}: LineChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
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
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {filteredKeys.map((key, idx) => (
              <linearGradient key={key} id={`line-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0.1} />
              </linearGradient>
            ))}
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
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={country?.color || colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: country?.color || colors[idx % colors.length],
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

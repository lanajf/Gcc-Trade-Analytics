import { useEffect, useState } from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { gccCountries } from '@/data/gcc-data';

interface RadarChartProps {
  data: { metric: string; [key: string]: number | string }[];
  title: string;
  dataKeys?: string[];
}

export function RadarChartComponent({ data, title, dataKeys }: RadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <SkeletonChart />;
  }

  const keys = dataKeys || gccCountries.slice(0, 3).map((c) => c.id);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.1)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 'auto']}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const country = gccCountries.find((c) => c.id === value);
              return country ? `${country.flag} ${country.name}` : value;
            }}
          />
          {keys.map((key, idx) => {
            const country = gccCountries.find((c) => c.id === key);
            return (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={country?.color || gccCountries[idx]?.color}
                fill={country?.color || gccCountries[idx]?.color}
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={1000}
              />
            );
          })}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

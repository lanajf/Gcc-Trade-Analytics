import { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SkeletonChart } from '@/components/ui/Skeleton';
import { gccCountries } from '@/data/gcc-data';

interface PieChartProps {
  data: { name: string; value: number }[];
  title: string;
  innerRadius?: number;
  outerRadius?: number;
}

export function PieChartComponent({
  data,
  title,
  innerRadius = 60,
  outerRadius = 100,
}: PieChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <SkeletonChart />;
  }

  const chartData = data.map((item) => {
    const country = gccCountries.find((c) => c.name === item.name || c.id === item.name);
    return {
      ...item,
      color: country?.color || '#3b82f6',
    };
  });

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <defs>
            {chartData.map((item, index) => (
              <linearGradient key={`gradient-${index}`} id={`pie-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                <stop offset="100%" stopColor={item.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#pie-${index})`}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => {
              const numValue = Number(value);
              return [`${numValue.toFixed(1)}% (${((numValue / 100) * total).toFixed(1)}B)`, 'Share'];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              const country = gccCountries.find((c) => c.name === value);
              return country ? `${country.flag} ${country.name}` : value;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

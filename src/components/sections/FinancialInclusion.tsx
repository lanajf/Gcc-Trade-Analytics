import { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Landmark, CreditCard, Wallet } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import {
  gccCountries,
  financialInclusionAccountOwnership,
  financialInclusionCreditToPrivate,
} from '@/data/gcc-data';
import { SkeletonChart } from '@/components/ui/Skeleton';

function GaugeChart({ title, value, country, color }: { title: string; value: number; country: string; color: string }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const rotation = (animatedValue / 100) * 180 - 90;

  return (
    <div className="chart-container space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id={`gauge-${country}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
                <stop offset="100%" stopColor={color} stopOpacity="1"/>
              </linearGradient>
            </defs>
            <path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke={`url(#gauge-${country})`}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(animatedValue / 100) * 251.2} 251.2`}
              className="transition-all duration-1000 ease-out"
            />
            <g transform={`rotate(${rotation} 100 95)`}>
              <line x1="100" y1="95" x2="100" y2="35" stroke={color} strokeWidth="3" strokeLinecap="round"/>
              <circle cx="100" cy="95" r="8" fill={color}/>
            </g>
          </svg>
        </div>
        <div className="mt-4 text-center">
          <p className="text-3xl font-bold text-foreground">{animatedValue}%</p>
          <p className="text-sm text-muted">{country}</p>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const chartData = gccCountries.map((c) => ({
    name: c.name,
    value: financialInclusionCreditToPrivate[c.id],
    color: c.color,
  })).sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => [`${Number(value)}% of GDP`, 'Credit to Private Sector']}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value) => {
              const country = gccCountries.find((c) => c.name === value);
              return country ? `${country.flag} ${country.name.split(' ')[0]}` : value;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className="text-sm text-muted">Average: {(total / gccCountries.length).toFixed(0)}% of GDP</p>
      </div>
    </div>
  );
}

function TrendChart({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SkeletonChart />;

  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const trendData = years.map((year, idx) => {
    const growth = 1 + idx * 0.015;
    const shock = year === 2020 ? 0.95 : 1;
    return {
      year,
      saudi: +(financialInclusionAccountOwnership.saudi * shock * growth / 1.075).toFixed(0),
      uae: +(financialInclusionAccountOwnership.uae * shock * growth / 1.075).toFixed(0),
      qatar: +(financialInclusionAccountOwnership.qatar * shock * growth / 1.075).toFixed(0),
    };
  });

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            domain={[80, 100]}
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => [`${Number(value)}%`, '']}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Line type="monotone" dataKey="saudi" stroke="#22c55e" strokeWidth={2} dot={false} name="Saudi Arabia" />
          <Line type="monotone" dataKey="uae" stroke="#3b82f6" strokeWidth={2} dot={false} name="UAE" />
          <Line type="monotone" dataKey="qatar" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Qatar" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FinancialInclusion() {
  const avgAccount = Object.values(financialInclusionAccountOwnership).reduce((a, b) => a + b, 0) / gccCountries.length;
  const avgCredit = Object.values(financialInclusionCreditToPrivate).reduce((a, b) => a + b, 0) / gccCountries.length;

  const topCountry = gccCountries.reduce((max, c) =>
    financialInclusionAccountOwnership[c.id] > financialInclusionAccountOwnership[max.id] ? c : max
  );

  return (
    <section id="financial" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Financial Inclusion</h2>
        <p className="text-muted">Banking access, credit availability, and financial service penetration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Account Ownership"
          value={`${avgAccount.toFixed(0)}%`}
          subtitle="GCC average"
          icon={<Landmark className="w-4 h-4" />}
          trend="up"
          trendValue="+4.2%"
          color="primary"
        />
        <KPICard
          title="Credit to Private Sector"
          value={`${avgCredit.toFixed(0)}%`}
          subtitle="of GDP"
          icon={<CreditCard className="w-4 h-4" />}
          trend="up"
          trendValue="+2.8%"
          color="secondary"
        />
        <KPICard
          title="Top Performer"
          value={topCountry.name}
          subtitle={`${financialInclusionAccountOwnership[topCountry.id]}% account ownership`}
          icon={<Wallet className="w-4 h-4" />}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {gccCountries.slice(0, 3).map((c) => (
          <GaugeChart
            key={c.id}
            title={`Account Ownership - ${c.name.split(' ')[0]}`}
            value={financialInclusionAccountOwnership[c.id]}
            country={c.name}
            color={c.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart title="Domestic Credit to Private Sector (% GDP)" />
        <TrendChart title="Account Ownership Trend (2019-2024)" />
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { ChartBar as BarChart3, Target, TrendingUp, Cpu } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { mlResults } from '@/data/gcc-data';

function AnimatedFeatureImportance() {
  const [animatedWidths, setAnimatedWidths] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      const widths: Record<string, number> = {};
      mlResults.featureImportance.forEach((f) => {
        widths[f.feature] = f.importance * 100;
      });
      setAnimatedWidths(widths);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-6">Feature Importance Ranking</h3>
      <div className="space-y-5">
        {mlResults.featureImportance.map((feature, idx) => {
          const width = animatedWidths[feature.feature] || 0;

          return (
            <div key={feature.feature} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">
                  #{idx + 1} {feature.feature}
                </span>
                <span className="text-muted font-mono">
                  {feature.importance.toFixed(2)}
                </span>
              </div>
              <div className="relative h-8 bg-sidebar-accent rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                  style={{
                    width: mounted ? `${width}%` : '0%',
                    backgroundColor: feature.color,
                    boxShadow: `0 0 20px ${feature.color}40`,
                  }}
                >
                  <span className="text-xs font-bold text-white/90">
                    {(feature.importance * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModelMetricsCard() {
  const [animatedValues, setAnimatedValues] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setAnimatedValues({
        accuracy: mlResults.randomForest.accuracy,
        precision: mlResults.randomForest.precision,
        recall: mlResults.randomForest.recall,
        f1Score: mlResults.randomForest.f1Score,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Accuracy', value: animatedValues.accuracy, color: '#3b82f6' },
    { label: 'Precision', value: animatedValues.precision, color: '#22c55e' },
    { label: 'Recall', value: animatedValues.recall, color: '#8b5cf6' },
    { label: 'F1 Score', value: animatedValues.f1Score, color: '#f59e0b' },
  ];

  return (
    <div className="chart-container">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/20">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Random Forest Model</h3>
          <p className="text-sm text-muted">Classification Performance Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-xl font-bold" style={{ color: metric.color }}>
                {animatedValues[metric.label.toLowerCase().replace(' ', '') as keyof typeof animatedValues]}%
              </span>
            </div>
            <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${animatedValues[metric.label.toLowerCase().replace(' ', '') as keyof typeof animatedValues]}%` : '0%',
                  backgroundColor: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OLSRegressionTable() {
  return (
    <div className="chart-container overflow-x-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/20">
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">OLS Regression Results</h3>
          <p className="text-sm text-muted">Ordinary Least Squares Coefficient Estimates</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-sidebar/50 border border-border/30">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">R-squared</p>
          <p className="text-2xl font-bold text-foreground">{mlResults.olsRegression.r2}</p>
        </div>
        <div className="p-4 rounded-xl bg-sidebar/50 border border-border/30">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Adj. R-squared</p>
          <p className="text-2xl font-bold text-foreground">{mlResults.olsRegression.adjustedR2}</p>
        </div>
        <div className="p-4 rounded-xl bg-sidebar/50 border border-border/30">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">F-statistic</p>
          <p className="text-2xl font-bold text-foreground">{mlResults.olsRegression.fStatistic}</p>
        </div>
        <div className="p-4 rounded-xl bg-sidebar/50 border border-border/30">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">p-value</p>
          <p className="text-2xl font-bold text-success">{mlResults.olsRegression.pValue.toFixed(4)}</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-3 text-muted-foreground font-medium">Variable</th>
            <th className="text-right py-3 text-muted-foreground font-medium">Coef.</th>
            <th className="text-right py-3 text-muted-foreground font-medium">Std. Error</th>
            <th className="text-right py-3 text-muted-foreground font-medium">t-value</th>
            <th className="text-right py-3 text-muted-foreground font-medium">p-value</th>
          </tr>
        </thead>
        <tbody>
          {mlResults.olsRegression.coefficients.map((coef) => (
            <tr key={coef.variable} className="border-b border-border/10 hover:bg-sidebar/30 transition-colors">
              <td className="py-3 text-foreground">{coef.variable}</td>
              <td className="py-3 text-right font-mono text-muted-foreground">{coef.coef.toFixed(3)}</td>
              <td className="py-3 text-right font-mono text-muted-foreground">{coef.stdError.toFixed(2)}</td>
              <td className="py-3 text-right font-mono text-muted-foreground">{coef.tValue.toFixed(2)}</td>
              <td className="py-3 text-right font-mono">
                <span className={coef.pValue < 0.05 ? 'text-success' : 'text-muted-foreground'}>
                  {coef.pValue.toFixed(3)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MachineLearningResults() {
  return (
    <section id="ml" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Machine Learning Results</h2>
        <p className="text-muted">Predictive model performance and feature analysis for trade balance forecasting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Model Accuracy"
          value={`${mlResults.randomForest.accuracy}%`}
          subtitle="Random Forest classifier"
          icon={<Target className="w-4 h-4" />}
          trend="up"
          trendValue="+2.3%"
          color="primary"
        />
        <KPICard
          title="R-squared"
          value={mlResults.olsRegression.r2.toFixed(3)}
          subtitle="OLS regression fit"
          icon={<BarChart3 className="w-4 h-4" />}
          trend="neutral"
          trendValue="Good fit"
          color="accent"
        />
        <KPICard
          title="Top Feature"
          value="Internet Use"
          subtitle="Importance: 0.32"
          icon={<TrendingUp className="w-4 h-4" />}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelMetricsCard />
        <AnimatedFeatureImportance />
      </div>

      <OLSRegressionTable />
    </section>
  );
}

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ExecutiveDashboard } from '@/components/sections/ExecutiveDashboard';
import { GCCCountriesOverview } from '@/components/sections/GCCCountriesOverview';
import { TradeBalanceAnalytics } from '@/components/sections/TradeBalanceAnalytics';
import { DigitalInnovation } from '@/components/sections/DigitalInnovation';
import { FinancialInclusion } from '@/components/sections/FinancialInclusion';
import { Sustainability } from '@/components/sections/Sustainability';
import { MachineLearningResults } from '@/components/sections/MachineLearningResults';
import { CorrelationMatrixSection } from '@/components/sections/CorrelationMatrix';
import { InsightsSection } from '@/components/sections/Insights';
import { RecommendationsSection } from '@/components/sections/Recommendations';

const sectionComponents: Record<string, React.ComponentType> = {
  executive: ExecutiveDashboard,
  countries: GCCCountriesOverview,
  trade: TradeBalanceAnalytics,
  digital: DigitalInnovation,
  financial: FinancialInclusion,
  sustainability: Sustainability,
  ml: MachineLearningResults,
  correlation: CorrelationMatrixSection,
  insights: InsightsSection,
  recommendations: RecommendationsSection,
};

function DashboardContent() {
  const [activeSection, setActiveSection] = useState('executive');
  const { isLoading, setIsLoading } = useDashboard();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const SectionComponent = sectionComponents[activeSection];

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 flex flex-col">
        <Header />

        <div id="dashboard-content" className="flex-1 p-6 space-y-8 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard key="chart-1" />
                <SkeletonCard key="chart-2" />
              </div>
            </div>
          ) : (
            <>
              <SectionComponent />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;

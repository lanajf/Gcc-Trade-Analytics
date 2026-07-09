import { createContext, useContext, useState, type ReactNode } from 'react';

interface DashboardContextType {
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  dateRange: { start: number; end: number };
  setDateRange: (range: { start: number; end: number }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: 2010, end: 2024 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <DashboardContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        dateRange,
        setDateRange,
        searchQuery,
        setSearchQuery,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

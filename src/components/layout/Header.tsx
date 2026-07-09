import { useState } from 'react';
import { Search, Sun, Moon, Download, FileText, Calendar, X, ListFilter as Filter } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import { exportToPDF, downloadChartAsPNG } from '@/lib/export';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, selectedCountry, dateRange } = useDashboard();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const years = Array.from({ length: 15 }, (_, i) => 2010 + i);

  return (
    <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search countries, metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-sidebar/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/20"
              >
                <X className="w-3 h-3 text-muted" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm',
              showDatePicker
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-sidebar/50 border-border text-muted hover:border-primary/50'
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>{dateRange.start} - {dateRange.end}</span>
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-[320px] mt-2 p-4 glass-card shadow-xl z-50">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted block mb-1">Start Year</label>
                  <select
                    value={dateRange.start}
                    onChange={() => {}}
                    className="bg-sidebar border border-border rounded-lg px-3 py-1.5 text-sm"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">End Year</label>
                  <select
                    value={dateRange.end}
                    onChange={() => {}}
                    className="bg-sidebar border border-border rounded-lg px-3 py-1.5 text-sm"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {selectedCountry && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm">
              <Filter className="w-3 h-3" />
              <span>Filtered: {selectedCountry}</span>
              <button className="ml-1 hover:text-accent/80">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    exportToPDF('dashboard-content');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-sidebar-accent text-foreground transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    downloadChartAsPNG('dashboard-content', 'gcc-analytics-dashboard');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-sidebar-accent text-foreground transition-colors"
                >
                  <Download className="w-4 h-4 text-secondary" />
                  Download as PNG
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-sidebar/50 border border-border hover:border-primary/50 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-warning" />
            ) : (
              <Moon className="w-5 h-5 text-accent" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

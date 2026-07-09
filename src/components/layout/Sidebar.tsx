import { useState } from 'react';
import { LayoutDashboard, Globe as Globe2, TrendingUp, Wifi, Landmark, Leaf, BrainCircuit, GitCompare, Sparkles, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'executive', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'countries', label: 'GCC Countries', icon: Globe2 },
  { id: 'trade', label: 'Trade Balance', icon: TrendingUp },
  { id: 'digital', label: 'Digital Innovation', icon: Wifi },
  { id: 'financial', label: 'Financial Inclusion', icon: Landmark },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'ml', label: 'ML Results', icon: BrainCircuit },
  { id: 'correlation', label: 'Correlation Matrix', icon: GitCompare },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'glass-sidebar h-screen sticky top-0 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex-1 py-6">
        <div className={cn('mb-8 px-6', collapsed && 'px-4')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-sidebar-foreground text-sm">GCC Analytics</h1>
                <p className="text-xs text-muted">2010-2024</p>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-4 p-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        )}
      </button>
    </aside>
  );
}

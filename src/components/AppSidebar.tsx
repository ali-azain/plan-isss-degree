import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CalendarDays, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/catalog', label: 'Catalog', icon: BookOpen },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card min-h-screen p-4 gap-2">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <img src="/logo.png" alt="ISSS Logo" className="h-10 w-10 object-contain" />
        <span className="font-semibold text-foreground text-lg">ISSS Planner</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </aside>
  );
}

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around py-2 px-4">
      {navItems.map(item => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-center gap-0.5 text-xs font-medium transition-colors px-3 py-1 rounded-lg',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

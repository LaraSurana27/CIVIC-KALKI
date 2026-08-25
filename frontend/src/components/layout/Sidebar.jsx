import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  Building2,
  FileText,
  GitBranch,
  Users,
  Brain,
  BarChart3,
  Briefcase,
  Settings,
  X,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: CalendarClock },
  { to: '/entities', label: 'Entities', icon: Building2 },
  { to: '/forms', label: 'Forms', icon: FileText },
  { to: '/processes', label: 'Processes', icon: GitBranch },
  { to: '/stakeholders', label: 'Stakeholders', icon: Users },
  { to: '/insights', label: 'AI Insights', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/cases', label: 'Cases', icon: Briefcase },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-civic-navy
          flex flex-col transition-transform duration-300
          shadow-[var(--shadow-sidebar)]
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-civic-border-dark flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-civic-accent flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-civic-text-inverse tracking-tight leading-none">
                CIVIC-KALKI
              </h1>
              <p className="text-[10px] text-civic-text-muted font-medium tracking-widest uppercase mt-0.5">
                Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-civic-text-muted hover:text-civic-text-inverse transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                      ${
                        isActive
                          ? 'bg-civic-accent text-white'
                          : 'text-civic-text-muted hover:bg-civic-navy-light hover:text-civic-text-inverse'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-civic-border-dark">
          <p className="text-[11px] text-civic-text-muted">
            Civic Intelligence Platform
          </p>
          <p className="text-[10px] text-civic-slate-light mt-0.5">v0.1.0 — Skeleton</p>
        </div>
      </aside>
    </>
  );
}

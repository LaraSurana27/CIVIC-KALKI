import {
  Activity,
  Users,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconMap = {
  Activity,
  Users,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
};

const changeIcons = {
  increase: TrendingUp,
  decrease: TrendingDown,
};

export default function StatCard({ label, value, change, changeType, icon }) {
  const Icon = iconMap[icon] || Activity;
  const ChangeIcon = changeIcons[changeType] || TrendingUp;

  return (
    <div className="bg-civic-surface rounded-lg border border-civic-border shadow-[var(--shadow-card)] p-5 flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-civic-text-secondary font-medium truncate">{label}</p>
        <p className="mt-1 text-2xl font-bold text-civic-text">{value}</p>
        {change && (
          <div className="mt-2 flex items-center gap-1">
            <ChangeIcon
              size={14}
              className={changeType === 'increase' ? 'text-status-success' : 'text-status-critical'}
            />
            <span
              className={`text-xs font-medium ${
                changeType === 'increase' ? 'text-status-success' : 'text-status-critical'
              }`}
            >
              {change} this week
            </span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 ml-4 p-2.5 rounded-lg bg-civic-accent/10">
        <Icon size={20} className="text-civic-accent" />
      </div>
    </div>
  );
}

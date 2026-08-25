import Card from '../ui/Card';
import {
  User, Shield, Hospital, Briefcase, GraduationCap, Heart, Building, Scale,
} from 'lucide-react';

const iconMap = {
  User, Shield, Hospital, Briefcase, GraduationCap, Heart, Building, Scale,
};

const colorMap = {
  active: 'bg-status-active-bg text-status-active',
  critical: 'bg-status-critical-bg text-status-critical',
  warning: 'bg-status-warning-bg text-status-warning',
  success: 'bg-status-success-bg text-status-success',
  pending: 'bg-status-pending-bg text-status-pending',
};

export default function StakeholderCard({ stakeholder }) {
  const Icon = iconMap[stakeholder.icon] || User;

  return (
    <Card hover className="p-5 flex items-center gap-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stakeholder.color] || colorMap.active}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-civic-text">{stakeholder.name}</p>
        <p className="text-xs text-civic-text-muted mt-0.5">
          {stakeholder.count} registered
        </p>
      </div>
    </Card>
  );
}

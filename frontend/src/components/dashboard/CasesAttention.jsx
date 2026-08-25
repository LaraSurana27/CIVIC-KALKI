import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertTriangle, Clock, Users } from 'lucide-react';

export default function CasesAttention({ cases }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-civic-text mb-4">Cases Requiring Attention</h3>
      <div className="space-y-3">
        {cases.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-civic-border hover:bg-civic-surface-dim transition-colors"
          >
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                c.severity === 'critical'
                  ? 'bg-status-critical-bg'
                  : 'bg-status-warning-bg'
              }`}
            >
              <AlertTriangle
                size={16}
                className={
                  c.severity === 'critical' ? 'text-status-critical' : 'text-status-warning'
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-civic-text">{c.title}</p>
                <Badge status={c.severity} className="flex-shrink-0">
                  {c.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-civic-text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {c.daysOpen} days open
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {c.stakeholders} stakeholders
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

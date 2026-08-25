import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { CalendarClock, MapPin } from 'lucide-react';

export default function ActiveEvents({ events }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-civic-text mb-4">Active Events</h3>
      <div className="space-y-3">
        {events
          .filter((e) => e.status === 'active')
          .slice(0, 4)
          .map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-civic-surface-dim hover:bg-civic-surface-muted transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-civic-accent/10 flex items-center justify-center">
                <CalendarClock size={18} className="text-civic-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-civic-text truncate">{event.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-civic-text-muted flex-shrink-0" />
                  <span className="text-xs text-civic-text-secondary truncate">
                    {event.location}
                  </span>
                </div>
              </div>
              <Badge status={event.severity === 'high' ? 'critical' : 'active'}>
                {event.type}
              </Badge>
            </div>
          ))}
      </div>
    </Card>
  );
}

import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { MapPin, CalendarDays, Users, GitBranch, Brain } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="block">
      <Card hover className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-civic-text">{event.title}</p>
            <p className="text-xs text-civic-text-secondary mt-0.5">{event.type}</p>
          </div>
          <Badge status={event.status}>{event.status}</Badge>
        </div>

        <p className="text-xs text-civic-text-secondary mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-civic-text-muted flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {event.date}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-civic-border text-xs text-civic-text-muted">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {event.entitiesInvolved} entities
          </span>
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {event.openProcesses} processes
          </span>
          <span className="flex items-center gap-1">
            <Brain size={12} />
            {event.aiInsights} insights
          </span>
        </div>
      </Card>
    </Link>
  );
}

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Building2, LinkIcon } from 'lucide-react';

export default function EntityCard({ entity }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-civic-accent/10 flex items-center justify-center">
          <Building2 size={18} className="text-civic-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-civic-accent uppercase tracking-wider">
                {entity.type}
              </p>
              <p className="text-sm font-semibold text-civic-text mt-0.5">{entity.name}</p>
            </div>
            <Badge status={entity.status}>{entity.status}</Badge>
          </div>
          <p className="text-xs text-civic-text-secondary mt-0.5">{entity.role}</p>
          <p className="text-xs text-civic-text-muted mt-2 line-clamp-2">
            {entity.description}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs text-civic-text-muted">
            <LinkIcon size={12} />
            <span>{entity.eventsLinked} linked events</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

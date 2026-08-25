import Badge from '../ui/Badge';

export default function EventEntities({ entities }) {
  return (
    <div className="space-y-2">
      {entities.map((entity, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 p-3 rounded-lg bg-civic-surface-dim"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-civic-text truncate">{entity.name}</p>
            <p className="text-xs text-civic-text-secondary">{entity.type}</p>
          </div>
          <Badge status="active">{entity.role}</Badge>
        </div>
      ))}
    </div>
  );
}

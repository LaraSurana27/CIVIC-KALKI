import EntityCard from '../components/entities/EntityCard';
import { entities } from '../data/mockEntities';

export default function Entities() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-civic-text">Entities</h1>
        <p className="text-sm text-civic-text-secondary mt-0.5">
          Organizations, departments, and actors across the civic ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
}

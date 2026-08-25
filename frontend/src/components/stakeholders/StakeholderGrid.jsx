import StakeholderCard from '../entities/StakeholderCard';

export default function StakeholderGrid({ stakeholders }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stakeholders.map((sh) => (
        <StakeholderCard key={sh.id} stakeholder={sh} />
      ))}
    </div>
  );
}

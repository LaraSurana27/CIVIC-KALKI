import StakeholderGrid from '../components/stakeholders/StakeholderGrid';
import { stakeholders } from '../data/mockEntities';

export default function Stakeholders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-civic-text">Stakeholders</h1>
        <p className="text-sm text-civic-text-secondary mt-0.5">
          Citizen and department registrations across the platform
        </p>
      </div>

      <StakeholderGrid stakeholders={stakeholders} />
    </div>
  );
}

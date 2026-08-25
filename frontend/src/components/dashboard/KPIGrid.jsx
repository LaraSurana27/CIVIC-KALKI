import StatCard from '../ui/StatCard';

export default function KPIGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <StatCard key={kpi.id} {...kpi} />
      ))}
    </div>
  );
}

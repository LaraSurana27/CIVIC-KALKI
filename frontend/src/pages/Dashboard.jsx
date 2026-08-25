import KPIGrid from '../components/dashboard/KPIGrid';
import ActiveEvents from '../components/dashboard/ActiveEvents';
import RecentIssues from '../components/dashboard/RecentIssues';
import CasesAttention from '../components/dashboard/CasesAttention';
import AIInsightCard from '../components/insights/AIInsightCard';
import { kpis, recentIssues, casesAttention } from '../data/mockDashboard';
import { events } from '../data/mockEvents';
import { insights } from '../data/mockInsights';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-civic-text">Dashboard</h1>
        <p className="text-sm text-civic-text-secondary mt-0.5">
          Real-time overview of civic intelligence operations
        </p>
      </div>

      {/* KPI Cards */}
      <KPIGrid kpis={kpis} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <RecentIssues issues={recentIssues} />
          <ActiveEvents events={events} />
        </div>

        {/* Right: 1/3 */}
        <div className="space-y-6">
          <CasesAttention cases={casesAttention} />

          {/* Quick AI Insight */}
          <div>
            <h3 className="text-base font-semibold text-civic-text mb-3">Latest AI Insight</h3>
            <AIInsightCard insight={insights[0]} />
          </div>
        </div>
      </div>
    </div>
  );
}

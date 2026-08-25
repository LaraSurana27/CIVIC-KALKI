import AIInsightCard from '../components/insights/AIInsightCard';
import { insights } from '../data/mockInsights';

export default function AIInsights() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-civic-text">AI Insights</h1>
        <p className="text-sm text-civic-text-secondary mt-0.5">
          System-generated analysis and recommendations across all civic events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

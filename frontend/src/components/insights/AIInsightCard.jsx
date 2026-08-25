import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Brain, ChevronRight } from 'lucide-react';

const severityMap = {
  high: 'warning',
  critical: 'critical',
  medium: 'active',
  low: 'success',
};

export default function AIInsightCard({ insight }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-civic-accent/10 flex items-center justify-center">
          <Brain size={18} className="text-civic-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-civic-accent uppercase tracking-wider">
              AI Insight
            </p>
            <Badge status={severityMap[insight.severity] || 'active'}>
              {insight.severity}
            </Badge>
          </div>

          <h4 className="text-sm font-semibold text-civic-text mt-1">
            {insight.title}
          </h4>

          <p className="text-sm text-civic-text-secondary mt-2 leading-relaxed">
            &ldquo;{insight.summary}&rdquo;
          </p>

          {/* Confidence */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-medium text-civic-text-secondary">Confidence:</span>
            <div className="flex-1 max-w-[120px] h-1.5 bg-civic-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-civic-accent transition-all duration-500"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
            <span className="text-xs font-bold text-civic-accent">{insight.confidence}%</span>
          </div>

          {/* Recommended areas */}
          <div className="mt-3 pt-3 border-t border-civic-border">
            <p className="text-xs font-medium text-civic-text-secondary mb-2">
              Recommended areas:
            </p>
            <ul className="space-y-1">
              {insight.areas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-civic-text-muted"
                >
                  <ChevronRight size={12} className="text-civic-accent flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata */}
          <p className="text-[11px] text-civic-text-muted mt-3">
            Generated {insight.generatedAt}
          </p>
        </div>
      </div>
    </Card>
  );
}

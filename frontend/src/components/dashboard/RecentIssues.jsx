import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Clock } from 'lucide-react';

const priorityMap = {
  high: 'critical',
  medium: 'warning',
  low: 'active',
};

export default function RecentIssues({ issues }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-civic-text mb-4">Recent Citizen Issues</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-civic-border">
              <th className="text-left py-2 px-2 text-xs font-semibold text-civic-text-secondary uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-civic-text-secondary uppercase tracking-wider">
                Issue
              </th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-civic-text-secondary uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-civic-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-2 px-2 text-xs font-semibold text-civic-text-secondary uppercase tracking-wider hidden lg:table-cell">
                Reported
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-civic-border">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-civic-surface-dim transition-colors">
                <td className="py-2.5 px-2 text-civic-text-muted font-mono text-xs">
                  {issue.id}
                </td>
                <td className="py-2.5 px-2 text-civic-text font-medium max-w-xs truncate">
                  {issue.title}
                </td>
                <td className="py-2.5 px-2 text-civic-text-secondary hidden md:table-cell">
                  {issue.category}
                </td>
                <td className="py-2.5 px-2">
                  <Badge status={issue.status}>{issue.status}</Badge>
                </td>
                <td className="py-2.5 px-2 hidden lg:table-cell">
                  <span className="flex items-center gap-1 text-xs text-civic-text-muted">
                    <Clock size={12} />
                    {issue.reportedAt}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

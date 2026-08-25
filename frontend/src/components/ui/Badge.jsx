const statusStyles = {
  active: 'bg-status-active-bg text-status-active',
  success: 'bg-status-success-bg text-status-success',
  resolved: 'bg-status-success-bg text-status-success',
  warning: 'bg-status-warning-bg text-status-warning',
  critical: 'bg-status-critical-bg text-status-critical',
  pending: 'bg-status-pending-bg text-status-pending',
};

export default function Badge({ status = 'active', children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
        ${statusStyles[status] || statusStyles.active}
        ${className}
      `}
    >
      {children || status}
    </span>
  );
}

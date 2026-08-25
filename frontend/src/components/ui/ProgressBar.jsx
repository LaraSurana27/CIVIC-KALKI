export default function ProgressBar({ value = 0, className = '', size = 'md' }) {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div
      className={`w-full bg-civic-surface-muted rounded-full overflow-hidden ${heights[size]} ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-civic-accent transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

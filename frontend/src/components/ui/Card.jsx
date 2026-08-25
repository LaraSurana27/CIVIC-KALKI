export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-civic-surface rounded-lg border border-civic-border
        shadow-[var(--shadow-card)]
        ${hover ? 'transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

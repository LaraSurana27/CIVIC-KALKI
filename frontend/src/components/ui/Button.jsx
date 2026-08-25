const variants = {
  primary:
    'bg-civic-accent text-white hover:bg-civic-accent-hover focus-visible:ring-civic-accent',
  secondary:
    'bg-civic-surface text-civic-text border border-civic-border hover:bg-civic-surface-muted focus-visible:ring-civic-accent',
  ghost:
    'bg-transparent text-civic-text-secondary hover:bg-civic-surface-muted hover:text-civic-text',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-colors duration-150 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

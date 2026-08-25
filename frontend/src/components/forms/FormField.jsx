import { Upload } from 'lucide-react';

/**
 * Universal form field renderer.
 * Renders the appropriate input based on `type` from the form metadata.
 * Supports: text, number, date, select, boolean, textarea, file
 */
export default function FormField({ field, onChange }) {
  const { id, label, type, value, options, required } = field;

  const baseInputClass = `
    w-full px-3 py-2 text-sm bg-civic-surface border border-civic-border rounded-lg
    text-civic-text placeholder:text-civic-text-muted
    focus:outline-none focus:ring-2 focus:ring-civic-accent focus:border-transparent
    transition-shadow
  `;

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            id={id}
            defaultValue={value || ''}
            required={required}
            className={baseInputClass}
            onChange={(e) => onChange?.(id, e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={id}
            defaultValue={value || ''}
            required={required}
            className={baseInputClass}
            onChange={(e) => onChange?.(id, e.target.value)}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={id}
            defaultValue={value || ''}
            required={required}
            className={baseInputClass}
            onChange={(e) => onChange?.(id, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            defaultValue={value || ''}
            required={required}
            className={`${baseInputClass} cursor-pointer`}
            onChange={(e) => onChange?.(id, e.target.value)}
          >
            <option value="">Select...</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={id}
              defaultChecked={!!value}
              className="w-4 h-4 rounded border-civic-border text-civic-accent focus:ring-civic-accent cursor-pointer accent-[var(--color-civic-accent)]"
              onChange={(e) => onChange?.(id, e.target.checked)}
            />
            <span className="text-sm text-civic-text-secondary">
              {value ? 'Yes' : 'No'}
            </span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            id={id}
            defaultValue={value || ''}
            required={required}
            rows={3}
            className={`${baseInputClass} resize-y`}
            onChange={(e) => onChange?.(id, e.target.value)}
          />
        );

      case 'file':
        return (
          <label
            htmlFor={id}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-civic-border rounded-lg
              text-sm text-civic-text-muted hover:border-civic-accent hover:text-civic-accent
              transition-colors cursor-pointer"
          >
            <Upload size={16} />
            <span>Choose file or drag here</span>
            <input
              type="file"
              id={id}
              className="sr-only"
              onChange={(e) => onChange?.(id, e.target.files?.[0])}
            />
          </label>
        );

      default:
        return (
          <input
            type="text"
            id={id}
            defaultValue={value || ''}
            className={baseInputClass}
            onChange={(e) => onChange?.(id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-civic-text">
        {label}
        {required && <span className="text-status-critical ml-0.5">*</span>}
      </label>
      {renderField()}
    </div>
  );
}

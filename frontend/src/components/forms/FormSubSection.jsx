import FormField from './FormField';

export default function FormSubSection({ subsection, onChange }) {
  const { title, parameters } = subsection;

  // Group parameters by category
  const grouped = parameters.reduce((acc, param) => {
    const cat = param.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(param);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-civic-text-secondary">{title}</h4>

      {Object.entries(grouped).map(([category, params]) => (
        <div key={category}>
          {Object.keys(grouped).length > 1 && (
            <p className="text-xs font-medium text-civic-text-muted uppercase tracking-wider mb-2">
              {category}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {params.map((param) => (
              <FormField key={param.id} field={param} onChange={onChange} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

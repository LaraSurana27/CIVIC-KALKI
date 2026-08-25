import FormSubSection from './FormSubSection';

export default function FormSection({ section, onChange }) {
  const { title, subsections } = section;

  return (
    <div className="bg-civic-surface rounded-lg border border-civic-border overflow-hidden">
      <div className="px-5 py-3 bg-civic-surface-muted border-b border-civic-border">
        <h3 className="text-base font-semibold text-civic-text">{title}</h3>
      </div>
      <div className="p-5 space-y-6">
        {subsections.map((sub) => (
          <FormSubSection key={sub.id} subsection={sub} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

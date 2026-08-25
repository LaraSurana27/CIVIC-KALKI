import { useState } from 'react';
import FormSection from './FormSection';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { User, FileText, CheckCircle2, Send } from 'lucide-react';

export default function DynamicForm({ definition, onSubmit }) {
  const { entityType, entity, title, badge, description, sections } = definition;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Entity Header Banner */}
      <div className="p-5 rounded-xl bg-civic-surface border border-civic-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-civic-accent/10 flex items-center justify-center flex-shrink-0 text-civic-accent">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-civic-accent uppercase tracking-wider">
                  Entity Type: {entityType}
                </span>
                {badge && <Badge status="active">{badge}</Badge>}
              </div>
              <h2 className="text-lg font-bold text-civic-text">{title || entity}</h2>
            </div>
          </div>
          <div className="text-xs text-civic-text-secondary bg-civic-surface-muted px-3 py-1.5 rounded-lg border border-civic-border/60">
            Metadata-Driven Form Engine
          </div>
        </div>
        {description && (
          <p className="text-xs text-civic-text-secondary mt-3 pt-3 border-t border-civic-border leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {submitted ? (
        <div className="p-8 rounded-xl bg-status-success-bg/40 border border-status-success/30 text-center animate-fade-in space-y-3">
          <div className="w-14 h-14 rounded-full bg-status-success text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 size={30} />
          </div>
          <h3 className="text-lg font-bold text-civic-text">Form Successfully Captured!</h3>
          <p className="text-sm text-civic-text-secondary max-w-lg mx-auto">
            This submission has created an active <strong>{entityType}</strong> record in the CIVIC-KALKI metadata registry. Dependent workflows and stakeholder routing are now active.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSubmitted(false)}
            >
              Fill / Edit Form Again
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Sections */}
          {sections.map((section) => (
            <FormSection key={section.id} section={section} onChange={handleChange} />
          ))}

          {/* Form Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-civic-border">
            <p className="text-xs text-civic-text-muted">
              Fields marked with <span className="text-status-critical font-bold">*</span> are mandatory parameters.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => alert('Draft saved locally into parameter cache!')}
              >
                <FileText size={16} />
                Save Draft
              </Button>
              <Button type="submit">
                <Send size={16} />
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

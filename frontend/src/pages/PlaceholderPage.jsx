import { Wrench } from 'lucide-react';
import Card from '../components/ui/Card';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in pt-12">
      <Card className="max-w-md w-full p-8 text-center bg-civic-surface-dim">
        <div className="w-16 h-16 bg-civic-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench size={28} className="text-civic-accent" />
        </div>
        <h1 className="text-2xl font-bold text-civic-text">{title}</h1>
        <p className="text-sm text-civic-text-secondary mt-3 leading-relaxed">
          {description}
        </p>
        <div className="mt-8 pt-6 border-t border-civic-border">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-civic-surface-muted text-civic-text-muted">
            Module under construction
          </span>
        </div>
      </Card>
    </div>
  );
}

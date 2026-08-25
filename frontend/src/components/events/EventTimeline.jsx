import { Clock, User } from 'lucide-react';

export default function EventTimeline({ timeline }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-civic-border" />

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex gap-4 relative">
            <div className="flex-shrink-0 w-[31px] flex justify-center z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-civic-accent border-2 border-civic-surface mt-1.5" />
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm text-civic-text">{item.event}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-civic-text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <User size={11} />
                  {item.actor}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

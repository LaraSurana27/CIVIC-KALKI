import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Megaphone,
  Briefcase,
  HeartPulse,
  Scale,
  MessageSquare,
  ChevronDown,
  Shield,
} from 'lucide-react';
import Button from '../components/ui/Button';

const eventTypes = [
  {
    icon: Megaphone,
    label: 'Public Protest',
    desc: 'Manage assemblies, safety, stakeholder coordination',
    color: 'bg-status-critical-bg text-status-critical',
  },
  {
    icon: Briefcase,
    label: 'Employment Assistance',
    desc: 'Job matching, skill assessment, placement coordination',
    color: 'bg-status-active-bg text-status-active',
  },
  {
    icon: HeartPulse,
    label: 'Medical Incident',
    desc: 'Emergency response, resource allocation, facility routing',
    color: 'bg-status-warning-bg text-status-warning',
  },
  {
    icon: Scale,
    label: 'Legal Dispute',
    desc: 'Case analysis, legal process, stakeholder notification',
    color: 'bg-status-pending-bg text-status-pending',
  },
  {
    icon: MessageSquare,
    label: 'Citizen Grievance',
    desc: 'Complaint tracking, department routing, resolution',
    color: 'bg-status-success-bg text-status-success',
  },
];

const pipelineSteps = [
  { label: 'Real-World Event', sublabel: 'Capture' },
  { label: 'Understand', sublabel: 'AI Analysis' },
  { label: 'Connect', sublabel: 'Stakeholders' },
  { label: 'Act', sublabel: 'Workflows' },
  { label: 'Outcome', sublabel: 'Resolution' },
];

export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-12">
      {/* Hero */}
      <section className="text-center pt-8 lg:pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-accent/10 text-civic-accent text-xs font-medium mb-6">
          <Shield size={14} />
          <span>Civic Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-civic-text leading-tight">
          Civic intelligence for
          <br />
          <span className="text-civic-accent">real-world problems.</span>
        </h1>

        <p className="mt-4 text-lg text-civic-text-secondary max-w-2xl mx-auto leading-relaxed">
          Understand events. Connect the right people. Enable the right action.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button size="lg">
              Go to Dashboard
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary" size="lg">
              View Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Pipeline Visual */}
      <section>
        <h2 className="text-center text-lg font-semibold text-civic-text mb-8">
          How CIVIC-KALKI Works
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
          {pipelineSteps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center text-center min-w-[120px]">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold
                    ${index === 0 ? 'bg-civic-accent text-white' : 'bg-civic-surface border border-civic-border text-civic-text'}
                  `}
                >
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-civic-text mt-2">{step.label}</p>
                <p className="text-xs text-civic-text-muted">{step.sublabel}</p>
              </div>

              {index < pipelineSteps.length - 1 && (
                <div className="hidden sm:flex items-center px-2">
                  <div className="w-8 h-px bg-civic-border" />
                  <ChevronDown size={14} className="text-civic-text-muted -rotate-90" />
                </div>
              )}

              {index < pipelineSteps.length - 1 && (
                <div className="flex sm:hidden items-center py-1">
                  <ChevronDown size={14} className="text-civic-text-muted" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Event Type Cards */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-civic-text">
            One platform. Every civic situation.
          </h2>
          <p className="text-sm text-civic-text-secondary mt-1">
            CIVIC-KALKI understands and manages diverse real-world events
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {eventTypes.map((et) => {
            const Icon = et.icon;
            return (
              <div
                key={et.label}
                className="bg-civic-surface rounded-lg border border-civic-border p-5 text-center
                  shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
              >
                <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${et.color}`}>
                  <Icon size={22} />
                </div>
                <p className="text-sm font-semibold text-civic-text mt-3">{et.label}</p>
                <p className="text-xs text-civic-text-muted mt-1 leading-relaxed">{et.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Hierarchy */}
      <section className="bg-civic-surface rounded-xl border border-civic-border p-6 lg:p-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-civic-text">
            Structured Intelligence Hierarchy
          </h2>
          <p className="text-sm text-civic-text-secondary mt-1">
            Every event is broken down into a structured, actionable hierarchy
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
          {[
            'Entity Type',
            'Entity',
            'Section',
            'SubSection',
            'Parameter Category',
            'Parameter',
            'Actual Value',
          ].map((item, index) => (
            <div key={item} className="w-full">
              <div
                className="py-2 px-4 rounded-lg text-center text-sm font-medium border"
                style={{
                  backgroundColor: `rgba(37, 99, 235, ${0.05 + index * 0.03})`,
                  borderColor: `rgba(37, 99, 235, ${0.15 + index * 0.05})`,
                  color: index > 3 ? '#2563eb' : '#334155',
                }}
              >
                {item}
              </div>
              {index < 6 && (
                <div className="flex justify-center py-0.5">
                  <ChevronDown size={16} className="text-civic-text-muted" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

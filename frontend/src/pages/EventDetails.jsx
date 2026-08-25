import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import EventTimeline from '../components/events/EventTimeline';
import EventEntities from '../components/events/EventEntities';
import AIInsightCard from '../components/insights/AIInsightCard';
import { eventDetail } from '../data/mockEvents';
import { insights } from '../data/mockInsights';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  Building2,
  UserPlus,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

export default function EventDetails() {
  const event = eventDetail;
  const eventInsights = insights.filter((i) => i.relatedEvent === event.id);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Back link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-sm text-civic-text-secondary hover:text-civic-accent transition-colors"
      >
        <ArrowLeft size={16} />
        Back to All Events
      </Link>

      {/* Event Header & Citizen Participation Action Banner */}
      <div className="bg-civic-surface rounded-xl border border-civic-border p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-civic-accent uppercase tracking-wider">
                Event Type: {event.type}
              </span>
              <Badge status={event.status}>{event.status}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-civic-text mt-1">{event.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-civic-text-secondary flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={15} className="text-civic-accent" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-civic-accent" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-civic-accent" />
                {event.time}
              </span>
            </div>
          </div>

          {/* Direct Citizen & Organizer Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/forms?type=protest-participant">
              <Button size="md" className="shadow-md">
                <UserPlus size={16} />
                Register as Citizen Participant
              </Button>
            </Link>
            <Link to="/forms?type=protest-reg">
              <Button variant="secondary" size="md">
                <FileCheck2 size={16} />
                View / Edit Event Application
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-civic-text-secondary mt-4 leading-relaxed max-w-4xl border-t border-civic-border/70 pt-3">
          {event.description}
        </p>

        <div className="flex items-center gap-4 mt-3 pt-2 text-xs text-civic-text-muted flex-wrap">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-civic-slate-light" />
            <span>Coordinating Authority: <strong>{event.coordinator}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-status-success" />
            <span>Police Security Status: <strong>Cleared & Monitored</strong></span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Involved Entities */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-civic-text mb-3 flex items-center justify-between">
              <span>Entities & Organizations Involved ({event.entities.length})</span>
              <span className="text-xs font-normal text-civic-text-muted">Auto-linked in metadata</span>
            </h2>
            <EventEntities entities={event.entities} />
          </Card>

          {/* Active Workflows & Clearance Processes */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-civic-text mb-3">
              Clearance & Governance Processes
            </h2>
            <div className="space-y-4">
              {event.processes.map((proc, index) => (
                <div key={index} className="bg-civic-surface-dim p-3 rounded-lg border border-civic-border/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-civic-text">{proc.name}</p>
                    <Badge status={proc.status}>{proc.status}</Badge>
                  </div>
                  <ProgressBar value={proc.progress} size="sm" />
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights & Safety Analysis */}
          <div>
            <h2 className="text-base font-semibold text-civic-text mb-3">
              AI Event Insights & Recommendations
            </h2>
            <div className="space-y-4">
              {eventInsights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: 1/3 */}
        <div className="space-y-6">
          {/* Impacted Stakeholders */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-civic-text mb-3">
              Department Stakeholders
            </h2>
            <div className="space-y-2.5">
              {event.stakeholders.map((sh, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-civic-surface-dim border border-civic-border/50"
                >
                  <div>
                    <p className="text-sm font-medium text-civic-text">{sh.name}</p>
                    <p className="text-xs text-civic-text-muted">{sh.department}</p>
                  </div>
                  <Badge status={sh.status}>{sh.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="p-5">
            <h2 className="text-base font-semibold text-civic-text mb-3">
              Event Activity Log
            </h2>
            <EventTimeline timeline={event.timeline} />
          </Card>
        </div>
      </div>
    </div>
  );
}

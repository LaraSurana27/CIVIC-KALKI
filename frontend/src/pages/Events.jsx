import { Link } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';
import { events } from '../data/mockEvents';
import { PlusCircle, Filter } from 'lucide-react';

export default function Events() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header with "+ Register New Event / Protest" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-civic-text">Events & Assemblies</h1>
          <p className="text-sm text-civic-text-secondary mt-0.5">
            Monitor, register, and coordinate public protests, drives, and civic gatherings.
          </p>
        </div>

        {/* Action Button for Event Owners to Register their Protest */}
        <div className="flex items-center gap-3">
          <Link to="/forms?type=protest-reg">
            <Button size="md" className="shadow-sm">
              <PlusCircle size={17} />
              Register New Event / Protest
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-civic-surface p-3.5 rounded-xl border border-civic-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-civic-text-secondary">
          <Filter size={14} className="text-civic-accent" />
          <span>Filter Events:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="px-3 py-1.5 text-xs bg-civic-surface-dim border border-civic-border rounded-lg
              text-civic-text focus:outline-none focus:ring-2 focus:ring-civic-accent cursor-pointer"
            aria-label="Filter by status"
            defaultValue="all"
          >
            <option value="all">All Statuses (Active, Pending, Resolved)</option>
            <option value="active">Active Now</option>
            <option value="pending">Pending Clearance</option>
            <option value="resolved">Resolved / Concluded</option>
          </select>
          <select
            className="px-3 py-1.5 text-xs bg-civic-surface-dim border border-civic-border rounded-lg
              text-civic-text focus:outline-none focus:ring-2 focus:ring-civic-accent cursor-pointer"
            aria-label="Filter by type"
            defaultValue="all"
          >
            <option value="all">All Event Types</option>
            <option value="Protest">Public Protests</option>
            <option value="Employment">Employment Drives</option>
            <option value="Medical">Medical Responses</option>
            <option value="Legal">Legal Hearings</option>
            <option value="Grievance">Grievance Assemblies</option>
          </select>
        </div>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

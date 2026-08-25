import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DynamicForm from '../components/forms/DynamicForm';
import {
  allForms,
  protestRegistrationForm,
  protestParticipantForm,
  employmentAssistanceForm,
  citizenGrievanceForm,
} from '../data/mockForms';
import { Megaphone, UserCheck, Briefcase, AlertCircle, Sparkles } from 'lucide-react';

const formTabs = [
  {
    id: 'protest-reg',
    label: '1. Register New Protest (Organizer)',
    sublabel: 'Event Owner Workflow',
    icon: Megaphone,
    form: protestRegistrationForm,
    tag: 'Event Owner',
  },
  {
    id: 'protest-participant',
    label: '2. Citizen Protest Registration',
    sublabel: 'Citizen Participation & Safety',
    icon: UserCheck,
    form: protestParticipantForm,
    tag: 'Citizen',
  },
  {
    id: 'employment',
    label: '3. Employment & Skill Assistance',
    sublabel: 'Job Matching & Welfare',
    icon: Briefcase,
    form: employmentAssistanceForm,
    tag: 'Worker',
  },
  {
    id: 'grievance',
    label: '4. Citizen Grievance Filing',
    sublabel: 'Municipal Issue Routing',
    icon: AlertCircle,
    form: citizenGrievanceForm,
    tag: 'Public Service',
  },
];

export default function Forms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formParam = searchParams.get('type') || 'protest-reg';

  const [activeTab, setActiveTab] = useState(formParam);

  useEffect(() => {
    if (searchParams.get('type')) {
      setActiveTab(searchParams.get('type'));
    }
  }, [searchParams]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSearchParams({ type: id });
  };

  const currentTab = formTabs.find((t) => t.id === activeTab) || formTabs[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-civic-accent bg-civic-accent/10 px-2.5 py-1 rounded-full mb-1">
            <Sparkles size={13} />
            <span>Universal Dynamic Form Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-civic-text">Dynamic Forms & Data Capture</h1>
          <p className="text-sm text-civic-text-secondary mt-0.5">
            Switch between real-world civic workflows: Event Owner registration, Citizen sign-up, Employment, and Grievances.
          </p>
        </div>
      </div>

      {/* Form Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {formTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer
                ${
                  isActive
                    ? 'bg-civic-surface border-civic-accent ring-2 ring-civic-accent/20 shadow-md'
                    : 'bg-civic-surface/60 border-civic-border hover:bg-civic-surface hover:border-civic-slate-light'
                }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-civic-accent text-white'
                      : 'bg-civic-surface-muted text-civic-text-secondary'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-civic-surface-muted text-civic-text-secondary">
                  {tab.tag}
                </span>
              </div>
              <div>
                <p className={`text-xs font-bold ${isActive ? 'text-civic-accent' : 'text-civic-text'}`}>
                  {tab.label}
                </p>
                <p className="text-[11px] text-civic-text-muted mt-0.5 truncate">
                  {tab.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Form Render */}
      <div className="mt-6">
        <DynamicForm
          key={currentTab.id}
          definition={currentTab.form}
          onSubmit={(data) => {
            console.log('Submitted metadata form:', data);
          }}
        />
      </div>
    </div>
  );
}

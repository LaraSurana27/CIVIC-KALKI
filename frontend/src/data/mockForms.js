// ==========================================
// 1. PROTEST / PUBLIC ASSEMBLY REGISTRATION (Organizer Form)
// ==========================================
export const protestRegistrationForm = {
  id: 'form-protest-reg',
  title: 'Public Protest & Assembly Registration',
  entityType: 'Event / Protest',
  entity: 'New Civic Assembly Application',
  badge: 'Organizer Workflow',
  description: 'Submitted by event organizers for municipal and police security clearance & resource deployment.',
  sections: [
    {
      id: 'organizer-details',
      title: 'Organizer & Entity Information',
      subsections: [
        {
          id: 'lead-organizer',
          title: 'Lead Organization & Representative',
          parameters: [
            {
              id: 'org-name',
              label: 'Organizing Body / Union / NGO',
              type: 'text',
              category: 'Organization',
              value: 'Citizens for Justice & Peace (CJP)',
              required: true,
            },
            {
              id: 'lead-rep',
              label: 'Lead Coordinator Name',
              type: 'text',
              category: 'Organization',
              value: 'Suresh Patil',
              required: true,
            },
            {
              id: 'contact-phone',
              label: 'Emergency Contact Phone',
              type: 'text',
              category: 'Contact',
              value: '+91 98220 11223',
              required: true,
            },
            {
              id: 'official-email',
              label: 'Official Email ID',
              type: 'text',
              category: 'Contact',
              value: 'contact@cjp-pune.org',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'event-logistics',
      title: 'Assembly Logistics & March Route',
      subsections: [
        {
          id: 'schedule-location',
          title: 'Location & Schedule',
          parameters: [
            {
              id: 'event-title',
              label: 'Event / Protest Title',
              type: 'text',
              category: 'Logistics',
              value: 'CJP Public Protest on Industrial Labour Reforms',
              required: true,
            },
            {
              id: 'event-date',
              label: 'Proposed Date of Assembly',
              type: 'date',
              category: 'Logistics',
              value: '2025-08-15',
              required: true,
            },
            {
              id: 'assembly-point',
              label: 'Assembly Point (Start Location)',
              type: 'text',
              category: 'Location',
              value: 'Deccan Gymkhana Ground, Pune',
              required: true,
            },
            {
              id: 'dispersal-point',
              label: 'Dispersal Point (End Location)',
              type: 'text',
              category: 'Location',
              value: 'District Collector Office, Pune',
              required: true,
            },
            {
              id: 'march-route',
              label: 'Planned March Route (Roads / Landmarks)',
              type: 'textarea',
              category: 'Location',
              value: 'Deccan Gymkhana -> JM Road -> Sancheti Chowk -> RTO -> Collectorate',
              required: true,
            },
          ],
        },
        {
          id: 'crowd-scope',
          title: 'Crowd Estimation & Demands',
          parameters: [
            {
              id: 'expected-turnout',
              label: 'Expected Turnout (Number of Participants)',
              type: 'number',
              category: 'Crowd',
              value: 2500,
              required: true,
            },
            {
              id: 'sound-permission',
              label: 'PA / Sound System Permission Required',
              type: 'boolean',
              category: 'Logistics',
              value: true,
              required: false,
            },
            {
              id: 'primary-demands',
              label: 'Summary of Grievances / Demands',
              type: 'textarea',
              category: 'Purpose',
              value: '1. Re-evaluation of industrial overtime policies. 2. Standardized safety compliance. 3. Swift resolution of pending wage disputes.',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'safety-compliance',
      title: 'Safety, Marshals & Medical Standby',
      subsections: [
        {
          id: 'safety-measures',
          title: 'Volunteer Deployment',
          parameters: [
            {
              id: 'marshals-count',
              label: 'Designated Volunteer Marshals',
              type: 'number',
              category: 'Safety',
              value: 50,
              required: true,
            },
            {
              id: 'first-aid-setup',
              label: 'Dedicated First Aid Station Planned',
              type: 'boolean',
              category: 'Safety',
              value: true,
              required: false,
            },
            {
              id: 'safety-affidavit',
              label: 'Upload Organizer Affidavit & Police NOC Form',
              type: 'file',
              category: 'Legal Documents',
              value: null,
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// ==========================================
// 2. CITIZEN PROTEST PARTICIPANT REGISTRATION
// ==========================================
export const protestParticipantForm = {
  id: 'form-protest-participant',
  title: 'Citizen Protest Participant Registration',
  entityType: 'Citizen / Participant',
  entity: 'Citizen Participation Badge',
  badge: 'Citizen Access',
  description: 'Voluntary check-in & safety registration for citizens attending civic events and demonstrations.',
  sections: [
    {
      id: 'participant-identity',
      title: 'Participant Identity & Contact',
      subsections: [
        {
          id: 'personal',
          title: 'Personal Info',
          parameters: [
            {
              id: 'citizen-name',
              label: 'Full Name',
              type: 'text',
              category: 'Identity',
              value: 'Aakash Deshmukh',
              required: true,
            },
            {
              id: 'citizen-age',
              label: 'Age',
              type: 'number',
              category: 'Identity',
              value: 28,
              required: true,
            },
            {
              id: 'citizen-phone',
              label: 'Mobile Number',
              type: 'text',
              category: 'Contact',
              value: '+91 97654 32109',
              required: true,
            },
            {
              id: 'ward-area',
              label: 'Residential Area / Ward',
              type: 'text',
              category: 'Location',
              value: 'Hadapsar, Ward 19',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'event-association',
      title: 'Event Participation Details',
      subsections: [
        {
          id: 'event-choice',
          title: 'Event & Affiliation',
          parameters: [
            {
              id: 'selected-event',
              label: 'Associated Civic Event',
              type: 'select',
              category: 'Event Link',
              value: 'CJP Public Protest (Pune)',
              options: [
                'CJP Public Protest (Pune)',
                'Hadapsar Employment Drive',
                'Baner Water Grievance Assembly',
                'Ward 14 Civic Hearing',
              ],
              required: true,
            },
            {
              id: 'role-type',
              label: 'Participation Role',
              type: 'select',
              category: 'Role',
              value: 'General Citizen Participant',
              options: [
                'General Citizen Participant',
                'Volunteer Safety Marshal',
                'Media / Press Representative',
                'Legal Observer',
              ],
              required: true,
            },
            {
              id: 'union-affiliation',
              label: 'Union / Organization Name (if any)',
              type: 'text',
              category: 'Affiliation',
              value: 'Pune Industrial Workers Forum',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'emergency-safety',
      title: 'Emergency Contact & Medical Information',
      subsections: [
        {
          id: 'safety-contact',
          title: 'Emergency Readiness',
          parameters: [
            {
              id: 'emergency-contact-name',
              label: 'Emergency Contact Person',
              type: 'text',
              category: 'Emergency',
              value: 'Sunita Deshmukh (Mother)',
              required: true,
            },
            {
              id: 'emergency-contact-phone',
              label: 'Emergency Contact Phone Number',
              type: 'text',
              category: 'Emergency',
              value: '+91 98900 44556',
              required: true,
            },
            {
              id: 'blood-group',
              label: 'Blood Group',
              type: 'select',
              category: 'Medical',
              value: 'O+',
              options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
              required: false,
            },
            {
              id: 'medical-notes',
              label: 'Medical Conditions / Allergies (Optional)',
              type: 'text',
              category: 'Medical',
              value: 'Asthma (Carries inhaler)',
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// ==========================================
// 3. CITIZEN EMPLOYMENT & SKILL ASSISTANCE
// ==========================================
export const employmentAssistanceForm = {
  id: 'form-employment',
  title: 'Citizen Employment & Skill Matching Form',
  entityType: 'Citizen',
  entity: 'Ravi Kumar',
  badge: 'Labour Dept Workflow',
  description: 'Captures worker skill profiles, certifications, and preferred job roles for automated ministry matching.',
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      subsections: [
        {
          id: 'basic-details',
          title: 'Basic Details',
          parameters: [
            {
              id: 'name',
              label: 'Full Name',
              type: 'text',
              category: 'Identity',
              value: 'Ravi Kumar',
              required: true,
            },
            {
              id: 'age',
              label: 'Age',
              type: 'number',
              category: 'Identity',
              value: 32,
              required: true,
            },
            {
              id: 'gender',
              label: 'Gender',
              type: 'select',
              category: 'Identity',
              value: 'Male',
              options: ['Male', 'Female', 'Other', 'Prefer not to say'],
              required: true,
            },
            {
              id: 'dob',
              label: 'Date of Birth',
              type: 'date',
              category: 'Identity',
              value: '1993-03-15',
              required: false,
            },
            {
              id: 'phone',
              label: 'Phone Number',
              type: 'text',
              category: 'Contact',
              value: '+91 98765 43210',
              required: true,
            },
          ],
        },
        {
          id: 'address',
          title: 'Address',
          parameters: [
            {
              id: 'city',
              label: 'City',
              type: 'text',
              category: 'Location',
              value: 'Pune',
              required: true,
            },
            {
              id: 'state',
              label: 'State',
              type: 'text',
              category: 'Location',
              value: 'Maharashtra',
              required: true,
            },
            {
              id: 'pincode',
              label: 'PIN Code',
              type: 'text',
              category: 'Location',
              value: '411038',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'employment',
      title: 'Employment & Skills',
      subsections: [
        {
          id: 'employment-status',
          title: 'Current Status',
          parameters: [
            {
              id: 'emp-status',
              label: 'Employment Status',
              type: 'select',
              category: 'Employment',
              value: 'Unemployed',
              options: ['Employed', 'Unemployed', 'Self-Employed', 'Student', 'Retired'],
              required: true,
            },
            {
              id: 'preferred-location',
              label: 'Preferred Location',
              type: 'text',
              category: 'Employment',
              value: 'Pune (Hadapsar / PCMC)',
              required: false,
            },
            {
              id: 'expected-salary',
              label: 'Expected Salary (₹)',
              type: 'number',
              category: 'Employment',
              value: 35000,
              required: false,
            },
            {
              id: 'willing-to-relocate',
              label: 'Willing to Relocate',
              type: 'boolean',
              category: 'Employment',
              value: false,
              required: false,
            },
          ],
        },
        {
          id: 'skills',
          title: 'Technical Competencies',
          parameters: [
            {
              id: 'skill-cnc',
              label: 'CNC Machine Experience',
              type: 'text',
              category: 'Technical Skills',
              value: '5 Years',
              required: false,
            },
            {
              id: 'skill-sap',
              label: 'SAP Production Planning',
              type: 'text',
              category: 'Technical Skills',
              value: '2 Years',
              required: false,
            },
            {
              id: 'skill-welding',
              label: 'Arc & Gas Welding',
              type: 'text',
              category: 'Technical Skills',
              value: '3 Years',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Assistance Preferences',
      subsections: [
        {
          id: 'assistance-type',
          title: 'Type of Assistance Needed',
          parameters: [
            {
              id: 'needs-training',
              label: 'Requires Advanced Skill Certification',
              type: 'boolean',
              category: 'Assistance',
              value: true,
              required: false,
            },
            {
              id: 'needs-placement',
              label: 'Requires Direct Employer Interview',
              type: 'boolean',
              category: 'Assistance',
              value: true,
              required: false,
            },
            {
              id: 'needs-financial',
              label: 'Requires Temporary Unemployment Stipend',
              type: 'boolean',
              category: 'Assistance',
              value: false,
              required: false,
            },
            {
              id: 'notes',
              label: 'Additional Worker Profile Notes',
              type: 'textarea',
              category: 'Assistance',
              value: 'Looking for manufacturing sector jobs in PCMC area. Has 5 years prior experience in automobile component manufacturing and lathe machinery.',
              required: false,
            },
            {
              id: 'resume',
              label: 'Upload Resume / Certificate',
              type: 'file',
              category: 'Documents',
              value: null,
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// ==========================================
// 4. CITIZEN GRIEVANCE REGISTRATION
// ==========================================
export const citizenGrievanceForm = {
  id: 'form-grievance',
  title: 'Citizen Grievance & Infrastructure Complaint',
  entityType: 'Grievance',
  entity: 'Municipal Issue Filing',
  badge: 'Public Service Portal',
  description: 'Direct citizen complaint filing routed automatically to concerned municipal wards and departments.',
  sections: [
    {
      id: 'grievance-details',
      title: 'Grievance Category & Incident Location',
      subsections: [
        {
          id: 'category-loc',
          title: 'Issue Scope',
          parameters: [
            {
              id: 'grievance-category',
              label: 'Grievance Domain',
              type: 'select',
              category: 'Category',
              value: 'Water Supply & Quality',
              options: [
                'Water Supply & Quality',
                'Roads & Potholes',
                'Sanitation & Garbage',
                'Streetlights & Electricity',
                'Illegal Encroachment',
                'Public Health & Drainage',
              ],
              required: true,
            },
            {
              id: 'urgency-level',
              label: 'Citizen Reported Urgency',
              type: 'select',
              category: 'Urgency',
              value: 'High (Immediate Action Required)',
              options: [
                'Low (Informational)',
                'Medium (Within 5 days)',
                'High (Immediate Action Required)',
                'Emergency (Within 24 hours)',
              ],
              required: true,
            },
            {
              id: 'ward-locality',
              label: 'Ward / Locality Name',
              type: 'text',
              category: 'Location',
              value: 'Baner, Ward No. 8',
              required: true,
            },
            {
              id: 'landmark',
              label: 'Nearest Landmark',
              type: 'text',
              category: 'Location',
              value: 'Opposite Cummins College Road',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'grievance-desc',
      title: 'Issue Description & Evidence',
      subsections: [
        {
          id: 'details',
          title: 'Description',
          parameters: [
            {
              id: 'issue-summary',
              label: 'Brief Title of Grievance',
              type: 'text',
              category: 'Details',
              value: 'Contaminated Water Supply for 4 Days in Housing Society',
              required: true,
            },
            {
              id: 'affected-households',
              label: 'Estimated Number of Affected Families',
              type: 'number',
              category: 'Impact',
              value: 120,
              required: true,
            },
            {
              id: 'full-explanation',
              label: 'Detailed Description of Problem',
              type: 'textarea',
              category: 'Details',
              value: 'The main pipeline supplying water to Baner Sector 3 has been leaking sewage water since Tuesday. Multiple residents have reported foul odor and water discoloration.',
              required: true,
            },
            {
              id: 'evidence-upload',
              label: 'Upload Photo / Video Evidence of Grievance',
              type: 'file',
              category: 'Evidence',
              value: null,
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// Default fallback export for backward compatibility
export const formDefinition = protestRegistrationForm;

// Array of all available dynamic forms for the UI switcher
export const allForms = [
  protestRegistrationForm,
  protestParticipantForm,
  employmentAssistanceForm,
  citizenGrievanceForm,
];

import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Entities from '../pages/Entities';
import Forms from '../pages/Forms';
import Stakeholders from '../pages/Stakeholders';
import AIInsights from '../pages/AIInsights';
import PlaceholderPage from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/events',
        element: <Events />,
      },
      {
        path: '/events/:id',
        element: <EventDetails />,
      },
      {
        path: '/entities',
        element: <Entities />,
      },
      {
        path: '/forms',
        element: <Forms />,
      },
      {
        path: '/stakeholders',
        element: <Stakeholders />,
      },
      {
        path: '/insights',
        element: <AIInsights />,
      },
      {
        path: '/processes',
        element: (
          <PlaceholderPage
            title="Processes Engine"
            description="Visual workflow builder for mapping civic procedures and routing rules."
          />
        ),
      },
      {
        path: '/analytics',
        element: (
          <PlaceholderPage
            title="Advanced Analytics"
            description="Deep data visualization and predictive modeling for civic trends."
          />
        ),
      },
      {
        path: '/cases',
        element: (
          <PlaceholderPage
            title="Case Management"
            description="End-to-end tracking for complex, multi-stakeholder civic cases."
          />
        ),
      },
      {
        path: '/settings',
        element: (
          <PlaceholderPage
            title="Platform Settings"
            description="Global configuration, access control, and integration management."
          />
        ),
      },
    ],
  },
]);

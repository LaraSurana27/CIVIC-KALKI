/**
 * API Service Layer — Placeholder
 *
 * This module provides a clean boundary between UI components and data sources.
 * Currently returns mock data. When the backend is ready, replace the mock
 * imports with actual fetch/axios calls without changing the function signatures.
 *
 * Future architecture:
 *   Frontend → api.js → Express/Python backend → PostgreSQL/Supabase → AI services
 */

import { kpis, recentIssues, casesAttention } from '../data/mockDashboard';
import { events, eventDetail } from '../data/mockEvents';
import { entities, stakeholders } from '../data/mockEntities';
import { formDefinition } from '../data/mockForms';
import { insights } from '../data/mockInsights';

// Dashboard
export const getDashboardKPIs = () => Promise.resolve(kpis);
export const getRecentIssues = () => Promise.resolve(recentIssues);
export const getCasesAttention = () => Promise.resolve(casesAttention);

// Events
export const getEvents = () => Promise.resolve(events);
export const getEventById = (id) => Promise.resolve(eventDetail);

// Entities & Stakeholders
export const getEntities = () => Promise.resolve(entities);
export const getStakeholders = () => Promise.resolve(stakeholders);

// Forms
export const getFormDefinition = (entityType, entityId) =>
  Promise.resolve(formDefinition);

// AI Insights
export const getInsights = () => Promise.resolve(insights);
export const getInsightsByEvent = (eventId) =>
  Promise.resolve(insights.filter((i) => i.relatedEvent === eventId));

/**
 * CIVIC-KALKI � Meme Studio Configuration
 * All allowlists, blocklists, and rate limits live here.
 * Changing this file is the ONLY change needed to adjust policy.
 */

// Workflow statuses that count as publicly visible
const PUBLICLY_VISIBLE_STATUSES = ['approved'];

// Category policy is intentionally centralized so deployments can adjust it.
const HUMOR_ALLOWED_CATEGORIES = [
  'garbage', 'potholes', 'streetlights', 'waterlogging', 'parks/public spaces',
];

const ALLOWED_CATEGORIES = [
  ...HUMOR_ALLOWED_CATEGORIES,
  'accidents', 'injury', 'health emergencies', "women's safety",
  'crime', 'harassment', 'communal', 'political',
];

// Safety-sensitive categories: no Relatable, only Awareness + Call to Action
const SAFETY_SENSITIVE_CATEGORIES = [
  'accidents', 'injury', 'health emergencies', "women's safety", 'women safety',
  'health emergency', 'disaster', 'flood', 'fire', 'political',
];

// Categories for which NO meme is allowed at all
const NO_MEME_CATEGORIES = [
  'crime', 'harassment', 'communal', 'sexual harassment',
];

// Per-user rate limits (configurable)
const RATE_LIMITS = {
  maxCampaignsPerDay: 5,
  maxCaptionGenerationsPerHour: 10,
};

// Caption length limits
const CAPTION_LIMITS = {
  headlineMaxChars: 60,
  captionMaxChars: 140,
};

const TEMPLATES = ['relatable', 'awareness', 'cta'];

// Deterministic safety blocklist - profanity/slurs
const PROFANITY_BLOCKLIST = [
  'fuck', 'shit', 'bastard', 'asshole', 'bitch', 'cunt',
  'nigger', 'faggot', 'chink', 'retard', 'spastic',
];

// Political party / politician names
const POLITICAL_BLOCKLIST = [
  'bjp', 'congress', 'aap', 'ncp', 'shiv sena', 'shivsena',
  'modi', 'rahul gandhi', 'kejriwal', 'sharad pawar',
];

// Regex patterns for PII / contact info
const PII_PATTERNS = [
  /\b\d{10}\b/,
  /\b(\+91[\-\s]?)?\d{5}[\-\s]?\d{5}\b/,
  /\b[A-Z]{2}-?\d{1,2}-?[A-Z]{1,3}-?\d{4}\b/i,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:https?:\/\/|ftp:\/\/)\S+/i,
  /\b[A-Za-z0-9-]+\.(?:com|org|net|in|gov|edu)(?:\/\S*)?\b/i,
  /www\.\S+/i,
  /@[A-Za-z0-9_]+/,
];

module.exports = {
  PUBLICLY_VISIBLE_STATUSES,
  HUMOR_ALLOWED_CATEGORIES,
  ALLOWED_CATEGORIES,
  SAFETY_SENSITIVE_CATEGORIES,
  NO_MEME_CATEGORIES,
  RATE_LIMITS,
  CAPTION_LIMITS,
  TEMPLATES,
  PROFANITY_BLOCKLIST,
  POLITICAL_BLOCKLIST,
  PII_PATTERNS,
};

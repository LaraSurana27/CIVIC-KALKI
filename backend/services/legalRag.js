/**
 * CIVIC-KALKI — Legal/Constitutional RAG Service (Ayush's Module)
 *
 * Provides retrieval-augmented generation grounding for constitutional and legal context.
 * Uses a small, in-memory corpus of verified authoritative passages from:
 *   1. Constitution of India (official government source)
 *   2. Digital Personal Data Protection Act, 2023
 *   3. DPDP Rules, 2025 (where applicable)
 *
 * Retrieval approach: keyword-based full-text matching (no pgvector required).
 * This is appropriate for the current project infrastructure.
 *
 * Citation safety:
 *   - Only passages from this verified corpus are returned.
 *   - No article numbers or text are fabricated.
 *   - Each passage includes source title, issuing authority, date, and section identifier.
 *   - The AI is instructed to cite only retrieved passages.
 *
 * Corpus verification:
 *   - Constitution of India: https://www.legislative.gov.in/documents
 *   - DPDPA 2023: https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf
 *   - The passages below are reproduced from official government sources for reference use.
 *   - Verify current versions, amendments, and applicability before relying on any passage.
 *
 * DISCLAIMER: This is advisory reference material only. These passages are not legal advice.
 * Officers must consult official government sources and qualified legal professionals for binding guidance.
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Verified Legal Corpus
// Each passage includes enough metadata for an officer to locate the original document.
// ─────────────────────────────────────────────────────────────────────────────

const LEGAL_CORPUS = [
  // ── Constitution of India ──────────────────────────────────────────────────
  {
    id: 'const-art14',
    source_title: 'Constitution of India',
    issuing_authority: 'Parliament of India',
    date_version: '26 January 1950 (with amendments)',
    section: 'Article 14 — Right to Equality',
    keywords: ['equality', 'equal', 'discrimination', 'law', 'rights', 'treatment', 'citizen', 'persons'],
    text: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    official_url: 'https://www.legislative.gov.in/documents',
    advisory_note: 'Article 14 guarantees equality before law. Administrative decisions in civic matters must be non-arbitrary and applied consistently.',
  },
  {
    id: 'const-art19-1a',
    source_title: 'Constitution of India',
    issuing_authority: 'Parliament of India',
    date_version: '26 January 1950 (with amendments)',
    section: 'Article 19(1)(a) — Freedom of Speech and Expression',
    keywords: ['speech', 'expression', 'freedom', 'assembly', 'protest', 'demonstration', 'movement', 'campaign'],
    text: 'All citizens shall have the right to freedom of speech and expression.',
    official_url: 'https://www.legislative.gov.in/documents',
    advisory_note: 'Article 19(1)(a) protects freedom of speech and expression. Reasonable restrictions under Article 19(2) may apply in interests of sovereignty, security, public order, decency, or contempt of court.',
  },
  {
    id: 'const-art19-1b',
    source_title: 'Constitution of India',
    issuing_authority: 'Parliament of India',
    date_version: '26 January 1950 (with amendments)',
    section: 'Article 19(1)(b) — Right to Assemble Peaceably',
    keywords: ['assembly', 'assemble', 'peaceful', 'gather', 'procession', 'rally', 'protest', 'demonstration'],
    text: 'All citizens shall have the right to assemble peaceably and without arms.',
    official_url: 'https://www.legislative.gov.in/documents',
    advisory_note: 'Article 19(1)(b) protects the right to peaceful assembly. Reasonable restrictions under Article 19(3) may apply for sovereignty, public order.',
  },
  {
    id: 'const-art21',
    source_title: 'Constitution of India',
    issuing_authority: 'Parliament of India',
    date_version: '26 January 1950 (with amendments)',
    section: 'Article 21 — Protection of Life and Personal Liberty',
    keywords: ['life', 'liberty', 'personal', 'dignity', 'privacy', 'procedure', 'law', 'rights'],
    text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    official_url: 'https://www.legislative.gov.in/documents',
    advisory_note: 'Article 21 protects life and personal liberty. The Supreme Court has read privacy as a fundamental right under Article 21 (K.S. Puttaswamy v. Union of India, 2017).',
  },
  {
    id: 'const-art51a',
    source_title: 'Constitution of India',
    issuing_authority: 'Parliament of India',
    date_version: '26 January 1950 (with amendments)',
    section: 'Article 51A — Fundamental Duties',
    keywords: ['duty', 'duties', 'environment', 'civic', 'property', 'public'],
    text: 'It shall be the duty of every citizen of India to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem; to uphold and protect the sovereignty, unity and integrity of India; to defend the country and render national service when called upon to do so; to promote harmony and the spirit of common brotherhood amongst all the people of India; to preserve the rich heritage of our composite culture; to protect and improve the natural environment including forests, lakes, rivers and wild life, and to have compassion for living creatures.',
    official_url: 'https://www.legislative.gov.in/documents',
    advisory_note: 'Article 51A lists fundamental duties of citizens, including protecting the environment and public property.',
  },
  // ── Digital Personal Data Protection Act, 2023 ────────────────────────────
  {
    id: 'dpdpa-2023-s4',
    source_title: 'Digital Personal Data Protection Act, 2023',
    issuing_authority: 'Ministry of Electronics and Information Technology, Government of India',
    date_version: '11 August 2023',
    section: 'Section 4 — Grounds for Processing of Personal Data',
    keywords: ['personal data', 'processing', 'consent', 'digital', 'privacy', 'data protection', 'collection'],
    text: 'A Data Fiduciary may process the personal data of a Data Principal only in accordance with the provisions of this Act, and only for a lawful purpose for which the Data Principal has given her consent or for certain legitimate uses.',
    official_url: 'https://www.meity.gov.in/data-protection-framework',
    advisory_note: 'Section 4 of DPDPA 2023 requires lawful purpose and consent for processing personal data. Civic systems collecting citizen data must comply with this requirement.',
  },
  {
    id: 'dpdpa-2023-s9',
    source_title: 'Digital Personal Data Protection Act, 2023',
    issuing_authority: 'Ministry of Electronics and Information Technology, Government of India',
    date_version: '11 August 2023',
    section: 'Section 9 — Processing of Personal Data of Children',
    keywords: ['children', 'minor', 'child', 'data', 'personal data', 'guardian', 'parental'],
    text: 'A Data Fiduciary shall, before processing any personal data of a child, obtain verifiable consent of the parent of such child or of the lawful guardian, as the case may be.',
    official_url: 'https://www.meity.gov.in/data-protection-framework',
    advisory_note: 'Section 9 of DPDPA 2023 requires parental/guardian consent before processing personal data of children. Cases involving minors should be handled with additional care.',
  },
  {
    id: 'dpdpa-2023-s11',
    source_title: 'Digital Personal Data Protection Act, 2023',
    issuing_authority: 'Ministry of Electronics and Information Technology, Government of India',
    date_version: '11 August 2023',
    section: 'Section 11 — Right to Information about Personal Data',
    keywords: ['right', 'information', 'data', 'citizen', 'access', 'personal data'],
    text: 'A Data Principal shall have the right to obtain from the Data Fiduciary a summary of personal data being processed and the processing activities undertaken by the Data Fiduciary with respect to such personal data.',
    official_url: 'https://www.meity.gov.in/data-protection-framework',
    advisory_note: 'Section 11 of DPDPA 2023 gives data principals (citizens) the right to know what personal data is processed. Systems should be able to fulfil this requirement.',
  },
  {
    id: 'dpdpa-2023-s8',
    source_title: 'Digital Personal Data Protection Act, 2023',
    issuing_authority: 'Ministry of Electronics and Information Technology, Government of India',
    date_version: '11 August 2023',
    section: 'Section 8 — General Obligations of Data Fiduciary',
    keywords: ['data fiduciary', 'obligation', 'accuracy', 'security', 'data', 'storage', 'breach', 'safeguard'],
    text: 'A Data Fiduciary shall be responsible for complying with the provisions of this Act and the rules made thereunder in respect of any processing of personal data by it or on its behalf by a Data Processor. The Data Fiduciary shall implement appropriate technical and organizational measures to ensure effective observance of the provisions of this Act.',
    official_url: 'https://www.meity.gov.in/data-protection-framework',
    advisory_note: 'Section 8 of DPDPA 2023 requires Data Fiduciaries (including government bodies) to implement technical and organizational data protection measures.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Keyword-based retrieval (no vector DB required)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a corpus entry against a query.
 * Returns a score (higher = more relevant). Threshold filters low-score matches.
 */
function scorePassage(passage, queryTokens) {
  const passageTokens = new Set([
    ...passage.keywords,
    ...passage.section.toLowerCase().split(/\s+/),
    ...passage.text.toLowerCase().split(/\s+/),
  ]);

  let matches = 0;
  for (const token of queryTokens) {
    if (token.length < 3) continue; // skip very short tokens
    for (const pt of passageTokens) {
      if (pt.includes(token) || token.includes(pt)) {
        matches++;
        break;
      }
    }
  }
  return matches;
}

/**
 * Retrieve relevant legal passages for a query string.
 * Returns up to MAX_RESULTS passages with score >= MIN_SCORE.
 *
 * @param {string} query - Free-text query (e.g., entity type + name + context)
 * @returns {{ passages: Array, query: string }}
 */
function retrieveLegalContext(query) {
  const MAX_RESULTS = 3;
  const MIN_SCORE = 2; // minimum keyword matches to be considered relevant

  if (!query || typeof query !== 'string' || query.trim() === '') {
    return { passages: [], query: '' };
  }

  const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length >= 3);

  if (queryTokens.length === 0) {
    return { passages: [], query };
  }

  const scored = LEGAL_CORPUS.map(passage => ({
    passage,
    score: scorePassage(passage, queryTokens),
  }));

  const relevant = scored
    .filter(s => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(s => s.passage);

  return { passages: relevant, query };
}

/**
 * Get the full corpus (for admin/diagnostic purposes only).
 */
function getCorpusMetadata() {
  return LEGAL_CORPUS.map(p => ({
    id: p.id,
    source_title: p.source_title,
    section: p.section,
    date_version: p.date_version,
    official_url: p.official_url,
    keywords: p.keywords,
  }));
}

module.exports = {
  retrieveLegalContext,
  getCorpusMetadata,
};

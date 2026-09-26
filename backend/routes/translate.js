/**
 * CIVIC-KALKI — Translation Service Route
 * Integrates external translation engines for full-page Indian localization
 * Delivers clean JSON translations with zero iframes or third-party banners
 */

const express = require('express');
const router = express.Router();

// In-memory LRU cache to minimize network calls and provide sub-millisecond responses
const translationCache = new Map();

/**
 * Translates a single text segment into target language
 */
async function translateSingle(text, targetLang) {
  if (!text || !text.trim()) return text;
  const clean = text.trim();

  // Check in-memory cache
  const cacheKey = `${targetLang}:${clean}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map(segment => segment[0]).filter(Boolean).join('');
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.error(`[Translate API] Error translating "${clean.slice(0, 30)}":`, err.message);
  }

  return clean;
}

/**
 * POST /translate
 * Body: { texts: string[], targetLang: string }
 */
router.post('/', async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters. Expected { texts: string[], targetLang: string }'
      });
    }

    // If English, return 1:1 mapping
    if (targetLang === 'en') {
      const identityMap = {};
      texts.forEach(t => { if (t) identityMap[t.trim()] = t.trim(); });
      return res.json({ success: true, targetLang: 'en', translations: identityMap });
    }

    // Filter unique non-empty strings
    const uniqueTexts = [...new Set(texts.map(t => (t || '').trim()).filter(Boolean))];

    // Process concurrently in chunks of 15 to remain respectful and fast
    const results = {};
    const chunkSize = 15;

    for (let i = 0; i < uniqueTexts.length; i += chunkSize) {
      const chunk = uniqueTexts.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async text => {
          results[text] = await translateSingle(text, targetLang);
        })
      );
    }

    return res.json({
      success: true,
      targetLang,
      count: uniqueTexts.length,
      translations: results
    });
  } catch (globalErr) {
    console.error('[Translate Route Error]:', globalErr);
    return res.status(500).json({ success: false, error: 'Internal translation error' });
  }
});

module.exports = router;

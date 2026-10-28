/**
 * CIVIC-KALKI — Safe Rule Evaluator Service
 *
 * Evaluates declarative JSON-logic conditions against data dictionaries without
 * using JavaScript eval() or Function() constructor.
 *
 * Supported operations:
 * - Literals: boolean, number, string, null
 * - Variables: { "var": "key_name" }
 * - Thresholds: { "threshold": "threshold_key" }
 * - Comparisons: ==, ===, !=, !==, >, >=, <, <=
 * - Logical: and, or, ! / not
 * - Collections: in, includes, some, non_empty
 * - Arithmetic: +, -, *, /
 */

const fs = require('fs');
const path = require('path');

let cachedThresholds = null;

function loadThresholds() {
  if (cachedThresholds) return cachedThresholds;
  try {
    const p = path.join(__dirname, '..', 'metadata', '_shared', 'thresholds.json');
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      cachedThresholds = data.thresholds || {};
    } else {
      cachedThresholds = {};
    }
  } catch (err) {
    cachedThresholds = {};
  }
  return cachedThresholds;
}

/**
 * Coerces numeric strings into numbers for safe arithmetic and comparison.
 */
function coerceValue(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed !== '' && !isNaN(trimmed)) {
      return Number(trimmed);
    }
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    return trimmed;
  }
  return val;
}

/**
 * Recursive evaluation of a JSON-logic AST node against a data context.
 *
 * @param {any} node - Expression node
 * @param {Record<string, any>} context - Entity parameter values
 * @param {Record<string, any>} [thresholds] - Custom thresholds override
 * @returns {any} Result of evaluation
 */
function evaluateRule(node, context = {}, thresholds = null) {
  const activeThresholds = thresholds || loadThresholds();

  // Primitive literals
  if (node === null || node === undefined) return null;
  if (typeof node !== 'object') return node;
  if (Array.isArray(node)) {
    return node.map((item) => evaluateRule(item, context, activeThresholds));
  }

  const keys = Object.keys(node);
  if (keys.length === 0) return {};

  const op = keys[0];
  const args = node[op];

  switch (op) {
    // ── Variable resolution ──────────────────────────────────────────────────
    case 'var': {
      const varName = Array.isArray(args) ? args[0] : args;
      const defaultVal = Array.isArray(args) && args.length > 1 ? args[1] : null;
      if (typeof varName !== 'string') return defaultVal;
      const raw = context[varName] !== undefined ? context[varName] : defaultVal;
      return coerceValue(raw);
    }

    // ── Threshold resolution ────────────────────────────────────────────────
    case 'threshold': {
      const tKey = Array.isArray(args) ? args[0] : args;
      const defaultVal = Array.isArray(args) && args.length > 1 ? args[1] : null;
      return activeThresholds[tKey] !== undefined ? activeThresholds[tKey] : defaultVal;
    }

    // ── Logical Operators ───────────────────────────────────────────────────
    case 'and': {
      const list = Array.isArray(args) ? args : [args];
      for (const item of list) {
        const val = evaluateRule(item, context, activeThresholds);
        if (!val) return false;
      }
      return true;
    }

    case 'or': {
      const list = Array.isArray(args) ? args : [args];
      for (const item of list) {
        const val = evaluateRule(item, context, activeThresholds);
        if (Boolean(val)) return true;
      }
      return false;
    }

    case '!':
    case 'not': {
      const target = Array.isArray(args) ? args[0] : args;
      return !evaluateRule(target, context, activeThresholds);
    }

    // ── Equality & Comparison ───────────────────────────────────────────────
    case '==':
    case '===': {
      const [left, right] = Array.isArray(args) ? args : [args, true];
      const lVal = coerceValue(evaluateRule(left, context, activeThresholds));
      const rVal = coerceValue(evaluateRule(right, context, activeThresholds));
      return lVal === rVal;
    }

    case '!=':
    case '!==': {
      const [left, right] = Array.isArray(args) ? args : [args, true];
      const lVal = coerceValue(evaluateRule(left, context, activeThresholds));
      const rVal = coerceValue(evaluateRule(right, context, activeThresholds));
      return lVal !== rVal;
    }

    case '>': {
      const [left, right] = args;
      const lVal = Number(coerceValue(evaluateRule(left, context, activeThresholds)));
      const rVal = Number(coerceValue(evaluateRule(right, context, activeThresholds)));
      if (isNaN(lVal) || isNaN(rVal)) return false;
      return lVal > rVal;
    }

    case '>=': {
      const [left, right] = args;
      const lVal = Number(coerceValue(evaluateRule(left, context, activeThresholds)));
      const rVal = Number(coerceValue(evaluateRule(right, context, activeThresholds)));
      if (isNaN(lVal) || isNaN(rVal)) return false;
      return lVal >= rVal;
    }

    case '<': {
      const [left, right] = args;
      const lVal = Number(coerceValue(evaluateRule(left, context, activeThresholds)));
      const rVal = Number(coerceValue(evaluateRule(right, context, activeThresholds)));
      if (isNaN(lVal) || isNaN(rVal)) return false;
      return lVal < rVal;
    }

    case '<=': {
      const [left, right] = args;
      const lVal = Number(coerceValue(evaluateRule(left, context, activeThresholds)));
      const rVal = Number(coerceValue(evaluateRule(right, context, activeThresholds)));
      if (isNaN(lVal) || isNaN(rVal)) return false;
      return lVal <= rVal;
    }

    // ── Collection operations ───────────────────────────────────────────────
    case 'in':
    case 'includes': {
      const [itemNode, collectionNode] = args;
      const item = coerceValue(evaluateRule(itemNode, context, activeThresholds));
      const collection = evaluateRule(collectionNode, context, activeThresholds);

      if (Array.isArray(collection)) {
        return collection.includes(item);
      }
      if (typeof collection === 'string') {
        return collection.includes(String(item));
      }
      return false;
    }

    case 'non_empty': {
      const target = Array.isArray(args) ? args[0] : args;
      const val = evaluateRule(target, context, activeThresholds);
      if (val === null || val === undefined) return false;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'string') return val.trim().length > 0;
      return true;
    }

    // ── Arithmetic ──────────────────────────────────────────────────────────
    case '+': {
      const [a, b] = args;
      return Number(evaluateRule(a, context, activeThresholds)) + Number(evaluateRule(b, context, activeThresholds));
    }
    case '-': {
      const [a, b] = args;
      return Number(evaluateRule(a, context, activeThresholds)) - Number(evaluateRule(b, context, activeThresholds));
    }
    case '*': {
      const [a, b] = args;
      return Number(evaluateRule(a, context, activeThresholds)) * Number(evaluateRule(b, context, activeThresholds));
    }
    case '/': {
      const [a, b] = args;
      const denom = Number(evaluateRule(b, context, activeThresholds));
      return denom !== 0 ? Number(evaluateRule(a, context, activeThresholds)) / denom : 0;
    }

    default:
      console.warn(`[RULE EVALUATOR] Unknown operator "${op}" — returning false.`);
      return false;
  }
}

module.exports = {
  evaluateRule,
  coerceValue,
  loadThresholds,
};

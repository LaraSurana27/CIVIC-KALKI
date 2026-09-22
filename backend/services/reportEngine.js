/**
 * CIVIC-KALKI — Generic Report Engine Service
 *
 * Executes dynamic reporting definitions stored in ReportMaster against generic
 * Entity and ParameterValue records.
 *
 * Supports:
 * - Table views, Count, Grouped count, Numeric aggregations (COUNT, SUM, AVG, MIN, MAX)
 * - Filtering by native Entity fields (area, status, location, dates) & dynamic parameters
 * - Security & RBAC data scoping (e.g. area matching for coordinator_area)
 * - Zero raw SQL concatenation; 100% safe parametric queries via Prisma Client
 */

const prisma = require('../db');

function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Safely parse JSON filters from ReportMaster.filters field
 */
function parseReportFilters(filtersConfig) {
  if (!filtersConfig) return {};
  if (typeof filtersConfig === 'object') return filtersConfig;
  try {
    return JSON.parse(filtersConfig);
  } catch (err) {
    return {};
  }
}

/**
 * Get all ReportMaster definitions.
 */
async function getReportDefinitions(entityTypeId = null) {
  const where = {};
  if (entityTypeId) {
    where.entity_type_id = Number(entityTypeId);
  }

  const reports = await prisma.reportMaster.findMany({
    where,
    include: {
      entityType: { select: { entity_type_id: true, name: true } },
    },
    orderBy: { report_id: 'asc' },
  });

  return reports.map((r) => ({
    report_id: r.report_id,
    entity_type_id: r.entity_type_id,
    entity_type_name: r.entityType?.name || 'Unknown',
    report_name: r.report_name,
    output_format: r.output_format || 'table',
    parsed_config: parseReportFilters(r.filters),
    raw_filters: r.filters,
  }));
}

/**
 * Get single ReportMaster definition by ID.
 */
async function getReportDefinitionById(reportId) {
  const report = await prisma.reportMaster.findUnique({
    where: { report_id: Number(reportId) },
    include: {
      entityType: { select: { entity_type_id: true, name: true } },
    },
  });

  if (!report) {
    throw createHttpError(`Report definition #${reportId} was not found.`, 404);
  }

  return {
    report_id: report.report_id,
    entity_type_id: report.entity_type_id,
    entity_type_name: report.entityType?.name || 'Unknown',
    report_name: report.report_name,
    output_format: report.output_format || 'table',
    parsed_config: parseReportFilters(report.filters),
    raw_filters: report.filters,
  };
}

/**
 * Execute a ReportMaster query safely.
 */
async function executeReport({ reportId, user, overrideFilters = {} }) {
  const def = await getReportDefinitionById(reportId);
  const config = def.parsed_config || {};

  const groupByField = (config.groupBy || config.group_by || '').trim();
  const metricType = String(config.metric || config.aggregation || 'COUNT').toUpperCase();
  const metricField = (config.metricField || config.metric_field || 'entity').trim();
  const baseWhere = config.where || config.filters || {};
  const outputFormat = def.output_format || 'table';

  // 1. Build Base Prisma Where Clause for Entity query
  const entityWhere = {
    entity_type_id: def.entity_type_id,
    status: { not: 'deleted' },
  };

  // 2. Enforce RBAC Scope
  let assignedArea = user?.assignedArea || user?.assigned_area;
  if (user && user.role === 'coordinator_area') {
    if (!assignedArea && user.user_id) {
      const dbUser = await prisma.user.findUnique({
        where: { user_id: Number(user.user_id) },
        select: { assignedArea: true },
      });
      assignedArea = dbUser?.assignedArea;
    }
    if (assignedArea) {
      entityWhere.area = assignedArea;
    }
  } else if (user && user.role === 'citizen') {
    if (!config.public_stats) {
      entityWhere.owner_user_id = user.user_id;
    }
  }

  // 3. Apply Base Report Where Clauses
  if (baseWhere.status && baseWhere.status !== 'all') {
    entityWhere.status = baseWhere.status;
  }
  if (baseWhere.area && baseWhere.area !== 'all') {
    entityWhere.area = baseWhere.area;
  }

  // 4. Apply Override Filters
  if (overrideFilters.status) {
    entityWhere.status = overrideFilters.status;
  }
  if (overrideFilters.area) {
    entityWhere.area = overrideFilters.area;
  }

  // Validate allowed metric types
  if (!['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(metricType)) {
    throw createHttpError(`Unsupported aggregation metric "${metricType}".`, 400);
  }

  // 5. Fetch Entities matching query with parameter values
  const entities = await prisma.entity.findMany({
    where: entityWhere,
    include: {
      entityType: { select: { entity_type_id: true, name: true } },
      owner: { select: { user_id: true, name: true } },
      parameterValues: {
        include: {
          parameterMaster: { select: { parameter_id: true, field_key: true, label: true, field_type: true } },
        },
      },
    },
    orderBy: { entity_id: 'asc' },
  });

  // 6. Helper: Extract field value from entity (native or dynamic parameter)
  const extractFieldValue = (ent, fieldKey) => {
    if (!fieldKey) return 'Unspecified';

    const normalizedKey = fieldKey.toLowerCase();
    if (['area', 'status', 'name', 'location', 'entity_id'].includes(normalizedKey)) {
      return ent[normalizedKey] ? String(ent[normalizedKey]) : 'Unassigned';
    }

    // Check parameter values
    const pv = ent.parameterValues.find((p) => {
      const k = String(p.parameterMaster?.field_key || '').toLowerCase();
      const l = String(p.parameterMaster?.label || '').toLowerCase();
      return k === normalizedKey || l === normalizedKey;
    });

    return pv && pv.value !== null && pv.value !== undefined && String(pv.value).trim() !== ''
      ? String(pv.value)
      : 'Unspecified';
  };

  // 7. Perform Aggregation / Grouping
  let rows = [];
  let columns = [];

  if (groupByField) {
    columns = [groupByField, metricType.toLowerCase()];

    const groups = {};

    for (const ent of entities) {
      const groupVal = extractFieldValue(ent, groupByField);
      if (!groups[groupVal]) {
        groups[groupVal] = [];
      }
      groups[groupVal].push(ent);
    }

    for (const [groupKey, groupEntities] of Object.entries(groups)) {
      let metricResult = 0;

      if (metricType === 'COUNT') {
        metricResult = groupEntities.length;
      } else {
        const numericValues = groupEntities
          .map((e) => {
            const raw = extractFieldValue(e, metricField);
            const num = Number(raw);
            return isNaN(num) ? null : num;
          })
          .filter((n) => n !== null);

        if (numericValues.length > 0) {
          if (metricType === 'SUM') {
            metricResult = numericValues.reduce((a, b) => a + b, 0);
          } else if (metricType === 'AVG') {
            metricResult = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          } else if (metricType === 'MIN') {
            metricResult = Math.min(...numericValues);
          } else if (metricType === 'MAX') {
            metricResult = Math.max(...numericValues);
          }
        }
      }

      rows.push({
        [groupByField]: groupKey,
        [metricType.toLowerCase()]: typeof metricResult === 'number' && !Number.isInteger(metricResult)
          ? Number(metricResult.toFixed(2))
          : metricResult,
      });
    }
  } else {
    if (outputFormat === 'count' || outputFormat === 'summary') {
      columns = ['total_count'];
      rows = [{ total_count: entities.length }];
    } else {
      columns = ['entity_id', 'name', 'entity_type', 'area', 'status', 'owner'];
      rows = entities.map((e) => ({
        entity_id: e.entity_id,
        name: e.name,
        entity_type: e.entityType?.name || 'Unknown',
        area: e.area || 'Unassigned',
        status: e.status,
        owner: e.owner?.name || 'System',
      }));
    }
  }

  return {
    reportId: def.report_id,
    reportName: def.report_name,
    entityTypeId: def.entity_type_id,
    entityTypeName: def.entity_type_name,
    outputFormat,
    metric: metricType,
    groupBy: groupByField || null,
    columns,
    rows,
    totalCount: entities.length,
    executedAt: new Date().toISOString(),
  };
}

module.exports = {
  getReportDefinitions,
  getReportDefinitionById,
  executeReport,
};

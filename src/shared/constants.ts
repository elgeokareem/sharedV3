import {
  CASE_STATUSES_RDN_MATCH,
  CASE_STATUSES,
  CASE_ORDER_TYPES,
} from './types';

export const RDN_SERVER_TIME_ZONE_OFFSET = -7;

export const RDN_TIME_ZONE = 'America/Phoenix';

export const ACCEPTED_RDN_STATUSES = [
  CASE_STATUSES_RDN_MATCH.open,
  CASE_STATUSES_RDN_MATCH.need_info,
  CASE_STATUSES_RDN_MATCH.pending_close,
  CASE_STATUSES_RDN_MATCH.pending,
  CASE_STATUSES_RDN_MATCH.pending_on_hold,
  CASE_STATUSES_RDN_MATCH.closed,
  CASE_STATUSES_RDN_MATCH.onHold,
  CASE_STATUSES_RDN_MATCH.repossessed,
];

export const MISSED_REPOSSESSED_STATUSES = [
  CASE_STATUSES.pending_close,
  CASE_STATUSES.pending_on_hold,
  CASE_STATUSES.closed,
  CASE_STATUSES.onHold,
];

export const VOLUNTARY_ORDER_TYPES = [
  CASE_ORDER_TYPES.condReport,
  CASE_ORDER_TYPES.pictures,
  CASE_ORDER_TYPES.voluntary,
  CASE_ORDER_TYPES.fieldVisit,
];

export const INVOLUNTARY_ORDER_TYPES = [
  CASE_ORDER_TYPES.investigate,
  CASE_ORDER_TYPES.investigateRepo,
  CASE_ORDER_TYPES.lprStaging,
  CASE_ORDER_TYPES.involuntary,
];

export const IMPOUND_ORDER_TYPES = [
  CASE_ORDER_TYPES.impoundRepo,
  CASE_ORDER_TYPES.impoundVoluntary,
];

export const ORDER_TYPE = {
  inVoluntary: 'InVoluntary',
  voluntary: 'Voluntary',
  impound: 'Impound',
};

export const RDN_ERRORS = {
  CHASE_CASE: 'Chase case',
  CASE_NOT_FOUND: 'CASE_NOT_FOUND',
  UNKNOWN_AGENT: 'UNKNOWN_AGENT',
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export const ERROR_MESSAGES = {
  startDateInvalid: 'startDate format invalid!',
  endDateInvalid: 'endDate format invalid!',
};

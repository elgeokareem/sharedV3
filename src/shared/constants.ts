/* eslint-disable jsdoc/check-tag-names */
import {
  CASE_STATUSES_RDN_MATCH,
  CASE_STATUSES,
  CASE_ORDER_TYPES,
} from './types';

export const RDN_SERVER_TIME_ZONE_OFFSET = -7;

export const RDN_TIME_ZONE = 'America/Phoenix';

export const TIMEZONES = {
  /**
   * @deprecated: Use RDNTimeZone instead
   */
  rdnTimeZone: 'America/Phoenix',
  RDNTimeZone: 'America/Phoenix',
};

export const TIMEFORMATS = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

export const RDN_STATUSES_OBJECT = {
  open: 'Open',
  need_info: 'Need Info',
  pending_close: 'Pending Close',
  pending: 'Pending',
  pending_on_hold: 'Pending On Hold',
  closed: 'Closed',
  onHold: 'On Hold',
  repossessed: 'Repossessed',
};

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

export const VOLUNTARY_ORDER_TYPES = [CASE_ORDER_TYPES.voluntary];

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
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

export const ERROR_MESSAGES = {
  startDateInvalid: 'startDate format invalid!',
  endDateInvalid: 'endDate format invalid!',
  branchNotFound: 'Invalid branchId',
  missedDateNotFound: 'Invalid missing Date',
};

export const CASE_ADDRESS_SOURCE = {
  RDN: 'RDN',
  SPOT: 'SPOT',
};

export const PLATFORM_SETTINGS = {
  translateAddressesWithinDays: 'TRANSLATE_ADDRESSES_WITHIN_DAYS',
  enableSubscriptionPaywall: 'ENABLE_SUBSCRIPTION_PAYWALL',
  enableProductTour: 'ENABLE_PRODUCT_TOUR',
  mobileAppApiUrl: 'MOBILE_APP_API_URL',
  enableInfractionMap: 'ENABLE_INFRACTION_MAP',
  enableNewActiveShift: 'ENABLE_NEW_ACTIVE_SHIFTS',
  enableSessionManagement: 'ENABLE_SESSION_MANAGEMENT',
  enableBiometrics: 'ENABLE_BIOMETRICS',
  enableUpdateLink: 'ENABLE_UPDATE_LINK',
  EXPIRATION_HOURS_FOR_SPOTTED_ALERT: 'EXPIRATION_HOURS_FOR_SPOTTED_ALERT',
  CASES_BATCH_SIZE_PER_UPDATE: 'CASES_BATCH_SIZE_PER_UPDATE',
  RDN_PAGE_SIZE: 'RDN_PAGE_SIZE',
};

export const CASE_RECORD_STATUS = {
  NEW: 'NEW',
  PROCESSED: 'PROCESSED',
};

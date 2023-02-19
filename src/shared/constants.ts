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
  INVALID_PAGE: 'INVALID_PAGE',
  REPOSSESSION_DATA_NOT_FOUND: 'REPOSSESSION_DATA_NOT_FOUND',
  IS_NEW_CLIENT: 'IS_NEW_CLIENT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
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
  ENABLE_RDN_POOL_PROCESSING: 'ENABLE_RDN_POOL_PROCESSING',
  RDN_PAGE_SIZE: 'RDN_PAGE_SIZE',
  ENABLE_SYNC_CASE_ADDRESSES: 'ENABLE_SYNC_CASE_ADDRESSES',
  JWT_EXPIRATION_IN_HOURS: 'JWT_EXPIRATION_IN_HOURS',
};

export const CASE_RECORD_STATUS = {
  NEW: 'NEW',
  PROCESSED: 'PROCESSED',
};

export const PLANS = {
  // The 'free' option is only to be able to filter what will be shown in
  // the system when there is no subscription.
  free: 'free',
  basic: 'basic',
  advanced: 'advanced',
};


export enum COMPANY_USER_STATUS {
  approved = 'approved',
  pending = 'pending',
  rejected = 'rejected',
  in_active = 'in_active',
  suspended = 'suspended',
  deleted = 'deleted',
};

export enum USER_STATUS {
  active = 'ACTIVE',
  disabled = 'DISABLED',
};

export enum STRIPE_SUBSCRIPTION_STATUS {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid'
};

/* User Roles & Types */
/**
 * @deprecated This is replaced by UserRoles.
 */
export const ROLES = {
  superAdmin: 'super_admin',
  admin: 'admin',
  manager: 'manager',
  driver: 'driver',
};
export enum UserRoles {
  // System Level
  SYSTEM_ADMIN_ROLE = 'system_admin',
  USER_ROLE = 'user',

  // Company Level
  SUPER_ADMIN_ROLE = 'super_admin',
  ADMIN_ROLE = 'admin',
  MANAGER_ROLE = 'manager',
  DRIVER_ROLE = 'driver',
}

export enum UserTypes {
  SYSTEM_ADMIN_TYPE = 'system_admin',
  SUPER_ADMIN_TYPE = 'super_admin',
  ADMINISTRATOR_TYPE = 'administrator',
  /**
   * @deprecated This is replaced by CUSTOMER_REP.
   */
  ADMIN_REP_TYPE = 'admin_rep',
  CUSTOMER_REP_TYPE = 'customer_rep',
  BRANCH_MANAGER_TYPE = 'branch_manager',
  INVESTIGATOR_TYPE = 'investigator',
  RECOVERY_AGENT_TYPE = 'recovery_agent',
  SPOTTER_TYPE = 'spotter',
  CAMERA_CAR_TYPE = 'camera_car'
}

export const ALL_SYSTEM_ROLES = [
  UserRoles.SYSTEM_ADMIN_ROLE,
  UserRoles.USER_ROLE,
];

export const ALL_COMPANY_ROLES = [
  UserRoles.SUPER_ADMIN_ROLE,
  UserRoles.ADMIN_ROLE,
  UserRoles.MANAGER_ROLE,
  UserRoles.DRIVER_ROLE,
];

export const ALL_USER_TYPES = [
  UserTypes.SYSTEM_ADMIN_TYPE,
  UserTypes.SUPER_ADMIN_TYPE,
  UserTypes.ADMINISTRATOR_TYPE,
  UserTypes.CUSTOMER_REP_TYPE,
  UserTypes.BRANCH_MANAGER_TYPE,
  UserTypes.INVESTIGATOR_TYPE,
  UserTypes.RECOVERY_AGENT_TYPE,
  UserTypes.SPOTTER_TYPE,
  UserTypes.CAMERA_CAR_TYPE,
];

export const ADMIN_ROLES = [UserRoles.SUPER_ADMIN_ROLE, UserRoles.ADMIN_ROLE];

export const MANAGER_ROLES = [UserRoles.SUPER_ADMIN_ROLE, UserRoles.MANAGER_ROLE, UserRoles.ADMIN_ROLE];

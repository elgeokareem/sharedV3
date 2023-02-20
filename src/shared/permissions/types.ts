import { UserRoles, UserTypes } from "../constants";
import { UserPositionType, UserRoleType } from "../types";

export type PERMISSION_GROUP_TYPE = `${UserRoles.SUPER_ADMIN_ROLE}-${UserTypes.ADMINISTRATOR_TYPE}` |
  `${UserRoles.SUPER_ADMIN_ROLE}-${UserTypes.SUPER_ADMIN_TYPE}` |
  `${UserRoles.ADMIN_ROLE}-${UserTypes.BRANCH_MANAGER_TYPE}` |
  `${UserRoles.MANAGER_ROLE}-${UserTypes.INVESTIGATOR_TYPE}` |
  `${UserRoles.DRIVER_ROLE}-${UserTypes.RECOVERY_AGENT_TYPE}` |
  `${UserRoles.DRIVER_ROLE}-${UserTypes.SPOTTER_TYPE}` |
  `${UserRoles.DRIVER_ROLE}-${UserTypes.CAMERA_CAR_TYPE}` |
  `${UserRoles.DRIVER_ROLE}-${UserTypes.CUSTOMER_REP_TYPE}`;

export type CompanyRoleType = Exclude<UserRoleType, 'user' | 'system_admin'>;
export type CompanyPositionType = Exclude<UserPositionType, 'system_admin' | 'admin_rep'>;

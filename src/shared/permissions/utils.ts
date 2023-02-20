import { RBACproject } from './index';
import { CompanyPositionType, CompanyRoleType, PERMISSION_GROUP_TYPE } from './types';

type PermissionDataType = {
  role: CompanyRoleType;
  position: CompanyPositionType;
  plan: string;
}

/**
 * Class to manage permissions.
 */
export class PermissionManager {
  private role: CompanyRoleType;
  private position: CompanyPositionType;
  private plan: string;

  constructor(data: PermissionDataType) {
    this.role = data.role;
    this.position = data.position;
    this.plan = data.plan;
  }

  public setPlan(plan: string) {
    this.plan = plan;
  }

  public hasPermission = (permission: string) => {
    return RBACproject.check(
      `${this.role}-${this.position}` as PERMISSION_GROUP_TYPE,
      permission,
      { plan: this.plan }
    )[0];
  };
}

/**
 * Method to verify if the user has the required permissions.
 * 
 * @param permission - Permission.
 * @param data - Object with values for check permission.
 * @returns Boolean to indicate whether you have permission.
 */
export const hasPermission = (
  permission: string,
  data: PermissionDataType
) => {
  const { role, position, plan } = data;
  return RBACproject.check(`${role}-${position}` as PERMISSION_GROUP_TYPE, permission, { plan })[0];
}

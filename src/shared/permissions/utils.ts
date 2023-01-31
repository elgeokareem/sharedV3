import { RoleType } from '../types';
import { AppPermissions } from './constants';
import { ParamsType, RBACproject } from './index';

/**
 * Method to verify if the subscription type has the required permissions.
 * 
 * @param permission - Permission.
 * @param subscriptionType - Subscription type.
 * @returns Boolean to indicate whether you have permission; string is message.
 */
export const checkPermission = (permission: string, role: RoleType, testData: ParamsType) => RBACproject.check(role, permission, testData);

export const canShowUserDetailInfractionTab = (role: RoleType, testData: ParamsType) => {
  return RBACproject.check(
    role, AppPermissions.SHOW_USER_DETAil_INFRACTION_HISTORY_TAB, testData
  )[0];
};

export const canShowUserDetailCommissionTab = (role: RoleType, testData: ParamsType) => {
  return RBACproject.check(
    role, AppPermissions.SHOW_USER_DETAil_COMMISSION_HISTORY_TAB, testData
  )[0];
};

export const canShowUserDetailTaskTab = (role: RoleType, testData: ParamsType) => {
  return RBACproject.check(
    role, AppPermissions.SHOW_USER_DETAil_TASK_HISTORY_TAB, testData
  )[0];
};

export const canShowUserDetailActivityTab = (role: RoleType, testData: ParamsType) => {
  return RBACproject.check(
    role, AppPermissions.SHOW_USER_DETAil_ACTIVITY_HISTORY_TAB, testData
  )[0];
};

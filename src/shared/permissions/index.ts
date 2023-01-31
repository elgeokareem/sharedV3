import { RBAC as RBACClass, ValidatorFunctionType } from '@cobuildlab/rbac';

import { ROLES } from '../constants';
import { RoleType } from '../types';
import { AppPermissions } from './constants';
import { rules } from './rules';

export type ParamsType = {
  plan: string
};

/**
 * @description This is the definition of the RBAC class.
 */
export const RBACproject = new RBACClass<RoleType, string>(ROLES.superAdmin as RoleType);

/**
 * @description Init rules rbac.
 */
(Object.keys(rules.permissions) as RoleType[]).forEach((role) => {
  let canRender = false;
  let dynamicRulesList = [];
  Object.values(AppPermissions).forEach((permission) => {
    canRender = rules.permissions[role].static.includes(permission);
    dynamicRulesList = Object.keys(rules.permissions[role].dynamic || {});
    if (canRender) {
      RBACproject.createRule(role, permission, true);
    } else if (dynamicRulesList.length) {
      const canDynamicRender = dynamicRulesList.includes(permission);
      if (canDynamicRender) {
        const test = rules.permissions[role].dynamic[permission] as ValidatorFunctionType;
        RBACproject.createRule(role, permission, test);
      }
    } else {
      RBACproject.createRule(role, permission, false);
    }
  });
});

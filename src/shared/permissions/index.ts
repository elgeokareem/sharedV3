import { RBAC as RBACClass, ValidatorFunctionType } from '@cobuildlab/rbac';

import { AppPermissions, PERMISSION_GROUPS } from './constants';
import { rules } from './rules';
import { PERMISSION_GROUP_TYPE } from './types';

export type ParamsType = {
  plan: string
};

/**
 * @description This is the definition of the RBAC class.
 */
export const RBACproject = new RBACClass<PERMISSION_GROUP_TYPE, string>(PERMISSION_GROUPS[0]);

/**
 * @description Init rules rbac.
 */
(Object.keys(rules.permissions) as PERMISSION_GROUP_TYPE[]).forEach((role) => {
  let canRender = false;
  let dynamicRulesList = [];
  Object.values(AppPermissions).forEach((permission) => {
    let testPermission: boolean | ValidatorFunctionType = false;
    canRender = rules.permissions[role].static.includes(permission);
    dynamicRulesList = Object.keys(rules.permissions[role].dynamic || {});

    if (canRender) {
      testPermission = true;

    } else if (dynamicRulesList.length) {
      const canDynamicRender = dynamicRulesList.includes(permission);
      if (canDynamicRender) {
        const objectDynamicPermissions = rules.permissions[role].dynamic;
        if (permission in objectDynamicPermissions) {
          testPermission = rules.permissions[role].dynamic[permission] as ValidatorFunctionType;
        } 
      }

    }

    RBACproject.createRule(role, permission, testPermission);

  });
});

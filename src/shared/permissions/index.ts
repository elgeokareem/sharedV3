import { RBAC as RBACClass } from '@cobuildlab/rbac';

import { PLANS } from '../constants';
import { Permissions } from './constants';
import { rules } from './rules';

/**
 * @description This is the definition of the RBAC class.
 */
export const RBACproject = new RBACClass(PLANS.basic);

/**
 * @description Init rules rbac.
 */
Object.keys(rules.permissions).forEach((subscriptionType) => {
  let canRender = false;
  Object.values(Permissions).forEach((permission) => {
    canRender = rules.permissions[subscriptionType].static.includes(permission);
    RBACproject.createRule(subscriptionType, permission, canRender);
  });
});

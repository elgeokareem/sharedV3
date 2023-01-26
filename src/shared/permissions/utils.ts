import { RBACproject } from './index';

/**
 * Method to verify if the subscription type has the required permissions.
 * 
 * @param permission - Permission.
 * @param subscriptionType - Subscription type.
 * @returns Boolean to indicate whether you have permission; string is message.
 */
export const checkPermission = (permission: string, subscriptionType: string) => RBACproject.check(subscriptionType, permission);

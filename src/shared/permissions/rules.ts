import { PLANS } from '../constants';
import { AppPermissions } from './constants';

export const rules = {
  permissions: {
    [PLANS.basic]: {
      static: [
        // Overview
        AppPermissions.SHOW_TOTAL_ASSIGNMENTS,
        // AppPermissions.SHOW_MISSED_REPOSSESSIONS,
        AppPermissions.SHOW_TOP_CAMERA_CARS,
        AppPermissions.SHOW_TOP_RECOVERY_AGENTS,
        // AppPermissions.SHOW_TOP_SPOTTERS,
        AppPermissions.SHOW_TOTAL_RECOVERY_RATE,
        AppPermissions.SHOW_TOTAL_REPOSSESSIONS,

        // Reports

        // Users
        // AppPermissions.SHOW_DRIVE_TIME_HOURS,
        AppPermissions.SHOW_MISSED_OPPORTUNITIES,
        // AppPermissions.SHOW_NUMBER_OF_INFRACTIONS,
        AppPermissions.SHOW_NUMBER_OF_REPOSSESSIONS,
        // AppPermissions.SHOW_NUMBER_OF_SPOTTED_VEHICLES,
        AppPermissions.SHOW_TASK_STATS,
        // AppPermissions.SHOW_TOTAL_HOURS_WORKED,
        // AppPermissions.SHOW_TOTAL_COMISSIONS,
      ],
    },
    [PLANS.advanced]: {
      static: [
        // Overview
        AppPermissions.SHOW_TOTAL_ASSIGNMENTS,
        AppPermissions.SHOW_MISSED_REPOSSESSIONS,
        AppPermissions.SHOW_TOP_CAMERA_CARS,
        AppPermissions.SHOW_TOP_RECOVERY_AGENTS,
        AppPermissions.SHOW_TOP_SPOTTERS,
        AppPermissions.SHOW_TOTAL_RECOVERY_RATE,
        AppPermissions.SHOW_TOTAL_REPOSSESSIONS,

        // Reports

        // Users
        AppPermissions.SHOW_DRIVE_TIME_HOURS,
        AppPermissions.SHOW_MISSED_OPPORTUNITIES,
        AppPermissions.SHOW_NUMBER_OF_INFRACTIONS,
        AppPermissions.SHOW_NUMBER_OF_REPOSSESSIONS,
        AppPermissions.SHOW_NUMBER_OF_SPOTTED_VEHICLES,
        AppPermissions.SHOW_TASK_STATS,
        AppPermissions.SHOW_TOTAL_HOURS_WORKED,
        AppPermissions.SHOW_TOTAL_COMISSIONS,
      ],
    },
  },
};

import { PLANS } from '../constants';
import { Permissions } from './constants';

export const rules = {
  permissions: {
    [PLANS.basic]: {
      static: [
        // Overview
        Permissions.SHOW_TOTAL_ASSIGNMENTS,
        // Permissions.SHOW_MISSED_REPOSSESSIONS,
        Permissions.SHOW_TOP_CAMERA_CARS,
        Permissions.SHOW_TOP_RECOVERY_AGENTS,
        // Permissions.SHOW_TOP_SPOTTERS,
        Permissions.SHOW_TOTAL_RECOVERY_RATE,
        Permissions.SHOW_TOTAL_REPOSSESSIONS,

        // Reports

        // Users
        // Permissions.SHOW_DRIVE_TIME_HOURS,
        Permissions.SHOW_MISSED_OPPORTUNITIES,
        // Permissions.SHOW_NUMBER_OF_INFRACTIONS,
        Permissions.SHOW_NUMBER_OF_REPOSSESSIONS,
        // Permissions.SHOW_NUMBER_OF_SPOTTED_VEHICLES,
        Permissions.SHOW_TASK_STATS,
        // Permissions.SHOW_TOTAL_HOURS_WORKED,
        // Permissions.SHOW_TOTAL_COMISSIONS,
      ],
    },
    [PLANS.advanced]: {
      static: [
        // Overview
        Permissions.SHOW_TOTAL_ASSIGNMENTS,
        Permissions.SHOW_MISSED_REPOSSESSIONS,
        Permissions.SHOW_TOP_CAMERA_CARS,
        Permissions.SHOW_TOP_RECOVERY_AGENTS,
        Permissions.SHOW_TOP_SPOTTERS,
        Permissions.SHOW_TOTAL_RECOVERY_RATE,
        Permissions.SHOW_TOTAL_REPOSSESSIONS,

        // Reports

        // Users
        Permissions.SHOW_DRIVE_TIME_HOURS,
        Permissions.SHOW_MISSED_OPPORTUNITIES,
        Permissions.SHOW_NUMBER_OF_INFRACTIONS,
        Permissions.SHOW_NUMBER_OF_REPOSSESSIONS,
        Permissions.SHOW_NUMBER_OF_SPOTTED_VEHICLES,
        Permissions.SHOW_TASK_STATS,
        Permissions.SHOW_TOTAL_HOURS_WORKED,
        Permissions.SHOW_TOTAL_COMISSIONS,
      ],
    },
  },
};

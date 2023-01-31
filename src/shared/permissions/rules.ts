import { ROLES } from '../constants';
import { AppPermissions } from './constants';
import { advancedOrBasicPlanValidator, advancedPlanValidator, allPlanValidator } from './validators';

export const rules = {
  permissions: {
    [ROLES.superAdmin]: {
      static: [
        AppPermissions.USER_DETAIL_VIEW,
        AppPermissions.SUBSCRIPTION_MANAGEMENT_VIEW,
        AppPermissions.SUPER_ADMIN_VIEW
      ],
      dynamic: {
        [AppPermissions.OVERVIEW_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.AGENT_REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_VIEW]: advancedPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_V2_VIEW]: advancedPlanValidator,
        [AppPermissions.SHIFT_MANAGEMENT_VIEW]: advancedPlanValidator,
        [AppPermissions.USERS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.TASKS_VIEW]: advancedPlanValidator,
        [AppPermissions.COMMISSIONS_VIEW]: advancedPlanValidator,
        [AppPermissions.CHECKLIST_VIEW]: advancedPlanValidator,
        [AppPermissions.USER_ACTIVITY_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_PAT_VIEW]: advancedPlanValidator,
        [AppPermissions.NOTIFICATIONS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SETTINGS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SYSTEM_VIEW]: advancedPlanValidator,
        [AppPermissions.DASHBOARD_VIEW]: advancedPlanValidator,
        [AppPermissions.EDIT_COMPANY_VIEW]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_MISSED_REPOSSESSIONS]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_ASSIGNMENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_RECOVERY_RATE]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_REPOSSESSIONS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_CAMERA_CARS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_RECOVERY_AGENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_SPOTTERS]: advancedPlanValidator,
        [AppPermissions.SHOW_USERS_METRIC_CHART]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAIL_CHECKLIST]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_INFRACTION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_COMMISSION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_TASK_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_ACTIVITY_HISTORY_TAB]: allPlanValidator,
        [AppPermissions.SHOW_TOPNAV_START_SHIFT_BUTTON]: advancedPlanValidator,
      }
    },
    [ROLES.admin]: {
      static: [
        AppPermissions.USER_DETAIL_VIEW,
        AppPermissions.SUBSCRIPTION_MANAGEMENT_VIEW,
      ],
      dynamic: {
        [AppPermissions.OVERVIEW_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.AGENT_REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_VIEW]: advancedPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_V2_VIEW]: advancedPlanValidator,
        [AppPermissions.SHIFT_MANAGEMENT_VIEW]: advancedPlanValidator,
        [AppPermissions.USERS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.TASKS_VIEW]: advancedPlanValidator,
        [AppPermissions.COMMISSIONS_VIEW]: advancedPlanValidator,
        [AppPermissions.CHECKLIST_VIEW]: advancedPlanValidator,
        [AppPermissions.USER_ACTIVITY_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_PAT_VIEW]: advancedPlanValidator,
        [AppPermissions.NOTIFICATIONS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SETTINGS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SYSTEM_VIEW]: advancedPlanValidator,
        [AppPermissions.DASHBOARD_VIEW]: advancedPlanValidator,
        [AppPermissions.EDIT_COMPANY_VIEW]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_MISSED_REPOSSESSIONS]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_ASSIGNMENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_RECOVERY_RATE]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_REPOSSESSIONS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_CAMERA_CARS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_RECOVERY_AGENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_SPOTTERS]: advancedPlanValidator,
        [AppPermissions.SHOW_USERS_METRIC_CHART]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAIL_CHECKLIST]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_INFRACTION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_COMMISSION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_TASK_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_ACTIVITY_HISTORY_TAB]: allPlanValidator,
        [AppPermissions.SHOW_TOPNAV_START_SHIFT_BUTTON]: advancedPlanValidator,
      }
    },
    [ROLES.manager]: {
      static: [
        AppPermissions.USER_DETAIL_VIEW,
      ],
      dynamic: {
        [AppPermissions.OVERVIEW_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.AGENT_REPORTS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_VIEW]: advancedPlanValidator,
        [AppPermissions.ACTIVE_SHIFTS_V2_VIEW]: advancedPlanValidator,
        [AppPermissions.SHIFT_MANAGEMENT_VIEW]: advancedPlanValidator,
        [AppPermissions.USERS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.TASKS_VIEW]: advancedPlanValidator,
        [AppPermissions.COMMISSIONS_VIEW]: advancedPlanValidator,
        [AppPermissions.USER_ACTIVITY_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_VIEW]: advancedPlanValidator,
        [AppPermissions.TIME_SHEET_PAT_VIEW]: advancedPlanValidator,
        [AppPermissions.NOTIFICATIONS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SETTINGS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SYSTEM_VIEW]: advancedPlanValidator,
        [AppPermissions.DASHBOARD_VIEW]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_MISSED_REPOSSESSIONS]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_ASSIGNMENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_RECOVERY_RATE]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_REPOSSESSIONS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_CAMERA_CARS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_RECOVERY_AGENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_SPOTTERS]: advancedPlanValidator,
        [AppPermissions.SHOW_USERS_METRIC_CHART]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAIL_CHECKLIST]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_INFRACTION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_COMMISSION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_TASK_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_ACTIVITY_HISTORY_TAB]: allPlanValidator,
        [AppPermissions.SHOW_TOPNAV_START_SHIFT_BUTTON]: advancedPlanValidator,
      }
    },
    [ROLES.driver]: {
      static: [
        AppPermissions.USER_DETAIL_VIEW,
      ],
      dynamic: {
        [AppPermissions.OVERVIEW_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.MY_STATS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.DASHBOARD_VIEW]: advancedPlanValidator,
        [AppPermissions.TASKS_VIEW]: advancedPlanValidator,
        [AppPermissions.NOTIFICATIONS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SETTINGS_VIEW]: advancedOrBasicPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_MISSED_REPOSSESSIONS]: advancedPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_ASSIGNMENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_RECOVERY_RATE]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOTAL_REPOSSESSIONS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_CAMERA_CARS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_RECOVERY_AGENTS]: allPlanValidator,
        [AppPermissions.SHOW_OVERVIEW_TOP_SPOTTERS]: advancedPlanValidator,
        [AppPermissions.SHOW_USERS_METRIC_CHART]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAIL_CHECKLIST]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_INFRACTION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_COMMISSION_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_TASK_HISTORY_TAB]: advancedPlanValidator,
        [AppPermissions.SHOW_USER_DETAil_ACTIVITY_HISTORY_TAB]: allPlanValidator,
        [AppPermissions.SHOW_TOPNAV_START_SHIFT_BUTTON]: advancedPlanValidator,
      }
    }
  }
};

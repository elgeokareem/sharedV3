import moment = require('moment');

import {
  TASK_STATUSES,
  TASK_FRIENDLY_STATUSES,
  TASK_FRIENDLY_STATUSES_COLORS,
} from './types';

const {
  completed,
  closed,
  marked_as_completed,
  new_deadline_proposed,
  new_deadline_approved,
  new_deadline_cancelled,
  new_deadline_declined,
  open,
  uncompleted,
} = TASK_STATUSES;

export const isTaskCompleted = (status: TASK_STATUSES) => status === completed;

export const isTaskClosed = (status: TASK_STATUSES) => status === closed;

export const isTaskPendingForApproval = (status: TASK_STATUSES) =>
  status === marked_as_completed || status === new_deadline_proposed;

export const isTaskIncompleted = (
  status: TASK_STATUSES,
  completionDate: string,
  currentDate = new Date().toISOString(),
) => {
  if (
    status === new_deadline_approved ||
    status === new_deadline_cancelled ||
    status === new_deadline_declined
  ) {
    if (moment(completionDate).isBefore(currentDate)) return true;
  }

  return status === uncompleted;
};

export const isTaskInProgress = (
  status: TASK_STATUSES,
  completionDate: string,
  currentDate = new Date().toISOString(),
) => {
  if (
    status === new_deadline_approved ||
    status === new_deadline_cancelled ||
    status === new_deadline_declined
  ) {
    if (moment(completionDate).isAfter(currentDate)) return true;
  }

  return status === open;
};

export const getTaskFriendlyStatus = (
  status: TASK_STATUSES,
  completionDate: string,
  currentDate = new Date().toISOString(),
) => {
  if (isTaskCompleted(status)) {
    return {
      status: TASK_FRIENDLY_STATUSES.completed,
      color: TASK_FRIENDLY_STATUSES_COLORS.completed,
    };
  }
  if (isTaskClosed(status)) {
    return {
      status: TASK_FRIENDLY_STATUSES.closed,
      color: TASK_FRIENDLY_STATUSES_COLORS.closed,
    };
  }
  if (isTaskPendingForApproval(status)) {
    return {
      status: TASK_FRIENDLY_STATUSES.pendingApproval,
      color: TASK_FRIENDLY_STATUSES_COLORS.pendingApproval,
    };
  }
  if (isTaskIncompleted(status, completionDate, currentDate)) {
    return {
      status: TASK_FRIENDLY_STATUSES.incomplete,
      color: TASK_FRIENDLY_STATUSES_COLORS.incomplete,
    };
  }
  if (isTaskInProgress(status, completionDate, currentDate)) {
    return {
      status: TASK_FRIENDLY_STATUSES.inProgress,
      color: TASK_FRIENDLY_STATUSES_COLORS.inProgress,
    };
  }

  return {};
};

/* eslint-disable no-unused-vars */
import { UserType } from '../../shared/types';

export enum TASK_STATUSES {
  open = 'open',
  closed = 'closed',
  new_deadline_approved = 'new_deadline_approved',
  new_deadline_cancelled = 'new_deadline_cancelled',
  new_deadline_declined = 'new_deadline_declined',
  completed = 'completed',
  new_deadline_proposed = 'new_deadline_proposed',
  marked_as_completed = 'marked_as_completed',
  uncompleted = 'uncompleted',
  acknowledged_uncompleted = 'acknowledged_uncompleted',
}

/**
 * Friendly statuses to show in the app based on the utils conditions.
 */
export enum TASK_FRIENDLY_STATUSES {
  completed = 'Completed',
  incomplete = 'Incomplete',
  inProgress = 'In Progress',
  closed = 'Closed',
}

/**
 * Friendly statuses colors to show in the app based on the utils conditions.
 */
export enum TASK_FRIENDLY_STATUSES_COLORS {
  completed = '#13BF94',
  incomplete = '#F24949',
  inProgress = '#FC9E3F',
  closed = '#006aff',
}

/**
 * TODO add missing fields.
 */
export type TaskType = {
  id: number;
  status: TASK_STATUSES;
  assignee?: UserType;
  assigner?: UserType;
  completionDate: string;
};

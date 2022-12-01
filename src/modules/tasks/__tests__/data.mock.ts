import { TASK_STATUSES } from '../types';

export const currentDate = new Date();
export const tomorrowDate = new Date(currentDate.getDate() + 1);
export const yesterdayDate = new Date(currentDate.getDate() - 1);

export const inProgressTask = {
  id: '1',
  status: TASK_STATUSES.new_deadline_approved,
  completionDate: tomorrowDate.toISOString(),
};

export const incompleteTask = {
  id: '2',
  status: TASK_STATUSES.new_deadline_approved,
  completionDate: yesterdayDate.toISOString(),
};

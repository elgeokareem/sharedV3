import { UserType } from 'shared/types';
import { TASK_STATUSES, TaskType } from '../types';

export const currentDate = new Date();
export const tomorrowDate = new Date(currentDate.getDate() + 1);
export const yesterdayDate = new Date(currentDate.getDate() - 1);

export const assigneeUser: UserType = {
  id: 1,
  firstName: 'John',
  lastName: 'First',
  email: 'test@mail.com',
} as UserType;

export const assignerUser: UserType = {
  id: 2,
  firstName: 'John',
  lastName: 'Second',
  email: 'test@mail.com',
} as UserType;

export const inProgressTask: TaskType = {
  id: 1,
  status: TASK_STATUSES.new_deadline_approved,
  completionDate: tomorrowDate.toISOString(),
};

export const incompleteTask: TaskType = {
  id: 2,
  status: TASK_STATUSES.new_deadline_approved,
  completionDate: yesterdayDate.toISOString(),
};

export const markedAsCompletedTask: TaskType = {
  id: 3,
  status: TASK_STATUSES.marked_as_completed,
  completionDate: yesterdayDate.toISOString(),
  assigner: assignerUser,
  assignee: assigneeUser,
};

export const completedTask: TaskType = {
  id: 4,
  status: TASK_STATUSES.completed,
  completionDate: yesterdayDate.toISOString(),
  assigner: assignerUser,
  assignee: assigneeUser,
};

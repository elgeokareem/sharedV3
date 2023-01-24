import { UserType } from '../../shared/types';
import { TASK_STATUSES, TaskType } from './types';

export const isAssigner = (task: TaskType, user: UserType) =>
  task?.assigner?.id === user?.id;

export const isAssignee = (task: TaskType, user: UserType) =>
  task?.assignee?.id === user?.id;

export const canAssignedDeleteTask = (task: TaskType, user: UserType) =>
  isAssignee(task, user) && task?.status === TASK_STATUSES.completed;

export const canAssignerDeleteTask = (task: TaskType, user: UserType) =>
  isAssigner(task, user) && task?.status === TASK_STATUSES.uncompleted;

export const canRequestAdditionalTime = (task: TaskType, user: UserType) =>
  isAssignee(task, user) &&
  task?.status !== TASK_STATUSES.marked_as_completed &&
  task?.status !== TASK_STATUSES.uncompleted;

export const canMarkAsCompleted = (task: TaskType, user: UserType) =>
  isAssignee(task, user) &&
  task?.status !== TASK_STATUSES.marked_as_completed;

export const canApproveMarkedAsCompleted = (task: TaskType, user: UserType) =>
  isAssigner(task, user) && task?.status === TASK_STATUSES.marked_as_completed;

export const canApproveNewDeadline = (task: TaskType, user: UserType) =>
  isAssigner(task, user) &&
  task?.status === TASK_STATUSES.new_deadline_proposed;

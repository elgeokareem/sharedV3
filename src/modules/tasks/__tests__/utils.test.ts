import { describe, expect, test } from '@jest/globals';

import {
  isTaskIncompleted,
  getTaskFriendlyStatus,
  isCompletedFilter,
  isIncompletedFilter,
  isPendingApprovalFilter,
  isTaskInProgress,
} from '../utils';
import {
  TASK_FRIENDLY_STATUSES,
  TASK_FRIENDLY_STATUSES_COLORS,
} from '../types';
import {
  closedTask,
  completedTask,
  incompleteTask,
  inProgressTask,
  markedAsCompletedTask,
} from './data.mock';

describe('Utils tests', () => {
  test('expect task to be incomplete', () => {
    expect(
      isTaskIncompleted(incompleteTask.status, incompleteTask.completionDate),
    ).toBeTruthy();
  });

  test('expect task to be in Progress', () => {
    expect(
      isTaskInProgress(inProgressTask.status, inProgressTask.completionDate),
    ).toBeTruthy();
  });

  test('expect task frienly status to be Incomplete', () => {
    expect(
      getTaskFriendlyStatus(
        incompleteTask.status,
        incompleteTask.completionDate,
      ),
    ).toMatchObject({
      status: TASK_FRIENDLY_STATUSES.incomplete,
      color: TASK_FRIENDLY_STATUSES_COLORS.incomplete,
    });
  });

  test('expect isCompletedFilter to return true', () => {
    expect(isCompletedFilter(completedTask.status)).toBeTruthy();
  });

  test('expect isCompletedFilter to return true', () => {
    expect(isCompletedFilter(closedTask.status)).toBeTruthy();
  });

  test('expect isIncompletedFilter to return true', () => {
    expect(
      isIncompletedFilter(incompleteTask.status, incompleteTask.completionDate),
    ).toBeTruthy();
  });

  test('expect isIncompletedFilter to return true', () => {
    expect(
      isIncompletedFilter(inProgressTask.status, inProgressTask.completionDate),
    ).toBeTruthy();
  });

  test('expect isPendingApprovalFilter to return true', () => {
    expect(isPendingApprovalFilter(markedAsCompletedTask.status)).toBeTruthy();
  });
});

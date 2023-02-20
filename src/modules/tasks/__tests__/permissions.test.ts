import { describe, expect, test } from '@jest/globals';

import {
  assigneeUser,
  assignerUser,
  completedTask,
  markedAsCompletedTask,
} from './data.mock';

import {
  canAssignedDeleteTask,
  canApproveMarkedAsCompleted,
} from '../permissions';

describe('permissions tests', () => {
  test('expect canApproveMarkedAsCompleted toBeTruthy', () => {
    expect(
      canApproveMarkedAsCompleted(markedAsCompletedTask, assignerUser),
    ).toBeTruthy();
  });

  test('expect canAssignedDeleteTask toBeTruthy', () => {
    expect(canAssignedDeleteTask(completedTask, assigneeUser)).toBeFalsy();
  });
});

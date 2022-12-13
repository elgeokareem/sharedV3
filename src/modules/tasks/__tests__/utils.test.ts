import { describe, expect, test } from '@jest/globals';

import { isTaskIncompleted, getTaskFriendlyStatus } from '../utils';
import {
  TASK_FRIENDLY_STATUSES,
  TASK_FRIENDLY_STATUSES_COLORS,
} from '../types';
import { incompleteTask, inProgressTask } from './data.mock';

describe('Utils tests', () => {
  test('expect task to be incomplete', () => {
    expect(
      isTaskIncompleted(incompleteTask.status, incompleteTask.completionDate),
    ).toBeTruthy();
  });

  test('expect task to be in Progress', () => {
    expect(
      isTaskIncompleted(inProgressTask.status, inProgressTask.completionDate),
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
});

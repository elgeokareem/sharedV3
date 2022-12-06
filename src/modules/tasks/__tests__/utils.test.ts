import { describe, expect, test } from '@jest/globals';
import moment = require('moment');

import { isTaskIncompleted, getTaskFriendlyStatus } from '../utils';
import {
  TASK_FRIENDLY_STATUSES,
  TASK_FRIENDLY_STATUSES_COLORS,
} from '../types';
import {
  IS_VALID_COMPLETION_DATE_ERROR,
  validateCompletionDate,
} from '../validators';
import { incompleteTask, inProgressTask } from './data.mock';

describe('validators tests', () => {
  test('expect completionDate to be invalid', () => {
    expect(
      validateCompletionDate(
        moment().add(9, 'minutes').toISOString(),
        new Date().toISOString(),
      ),
    ).toEqual([false, IS_VALID_COMPLETION_DATE_ERROR]);
  });

  test('expect completionDate to be valid', () => {
    expect(
      validateCompletionDate(
        moment().add(11, 'minutes').toISOString(),
        new Date().toISOString(),
      ),
    ).toEqual([true, '']);
  });
});

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

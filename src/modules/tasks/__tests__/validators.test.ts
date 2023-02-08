import { describe, expect, test } from '@jest/globals';
import moment = require('moment');
import { incompleteTask, inProgressTask } from './data.mock';

import {
  isTaskOnTime,
  IS_VALID_COMPLETION_DATE_ERROR,
  validateCompletionDate,
} from '../validators';

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

  test('expect isTaskOnTime to be true', () => {
    expect(isTaskOnTime(inProgressTask)).toBeTruthy();
  });

   test('expect isTaskOnTime to be false', () => {
     expect(isTaskOnTime(incompleteTask)).toBeFalsy();
   });
});

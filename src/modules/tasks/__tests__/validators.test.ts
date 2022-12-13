import { describe, expect, test } from '@jest/globals';
import moment = require('moment');

import {
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
});

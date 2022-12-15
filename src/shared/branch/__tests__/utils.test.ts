import { describe, expect, test } from '@jest/globals';
import { UserType } from 'shared/types';

import { filterUserByFullName, filterUser } from '../../utils';

describe('Branch Tests', () => {
  test('filterByFullName toBeTruthy', async () => {
    expect(filterUserByFullName('John first', 'John')).toBeTruthy();
  });

  test('filterByFullName toBeFalsy', async () => {
    expect(filterUserByFullName('John first', 'Johh')).toBeFalsy();
  });

  test('filterByFullName second toBeTruthy', async () => {
    expect(filterUserByFullName('John    Second', 'John SeConD')).toBeTruthy();
  });

  test('filterByFullName third toBeTruthy', async () => {
    expect(filterUserByFullName('John    ThiRd', 'thIr')).toBeTruthy();
  });

  test('filterUser toBeTruthy', async () => {
    expect(
      filterUser(
        { firstName: 'John', lastName: 'first' } as UserType,
        'John    FiRst',
      ),
    ).toBeTruthy();
  });

  test('filterUser second toBeTruthy', async () => {
    expect(
      filterUser(
        { firstName: 'John ', lastName: '  SeconD' } as UserType,
        'John SeConD',
      ),
    ).toBeTruthy();
  });
});

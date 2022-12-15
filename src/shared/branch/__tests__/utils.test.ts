import { describe, expect, test } from '@jest/globals';
import { UserType } from 'shared/types';

import { filterUserByFullName, filterUser } from '../../utils';

describe('Utils tests', () => {
  test('expect filterByFullName toBeTruthy', async () => {
    expect(filterUserByFullName('John first', 'John')).toBeTruthy();
  });

  test('expect filterByFullName toBeFalsy', async () => {
    expect(filterUserByFullName('John first', 'Johh')).toBeFalsy();
  });

  test('expect filterByFullName second toBeTruthy', async () => {
    expect(filterUserByFullName('John    Second', 'John SeConD')).toBeTruthy();
  });

  test('expect filterByFullName third toBeTruthy', async () => {
    expect(filterUserByFullName('John    ThiRd', 'thIr')).toBeTruthy();
  });

  test('expect filterUser toBeTruthy', async () => {
    expect(
      filterUser(
        { firstName: 'John', lastName: 'first' } as UserType,
        'John    FiRst',
      ),
    ).toBeTruthy();
  });

  test('expect filterUser second toBeTruthy', async () => {
    expect(
      filterUser(
        { firstName: 'John ', lastName: '  SeconD' } as UserType,
        'John SeConD',
      ),
    ).toBeTruthy();
  });
});

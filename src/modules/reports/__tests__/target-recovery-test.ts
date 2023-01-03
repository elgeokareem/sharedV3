import { describe, expect, test } from '@jest/globals';

import { createClient } from '../../../shared/tests/graphql';
import { fetchTargetRecoveryRatesByUser } from '../services';

describe('Target Recovery Rate Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

  const client = createClient(endpoint, token);

  const object1 = {
    branchId: 1,
    clientId: '201883',
    duration: 'MTD',
    targetRecoveryRate: 30,
    userId: 758,
  };

  const object2 = {
    branchId: 1,
    clientId: '201883',
    duration: 'YTD',
    targetRecoveryRate: 30,
    userId: 758,
  };

  test('Fetch Target Recovery Rate By User Length', async () => {
    const targetRecoveryRates = await fetchTargetRecoveryRatesByUser(
      client,
      758,
    );

    expect(targetRecoveryRates.length).toBe(2);
  });

  test('Fetch Target Recovery Rate By User Results', async () => {
    const targetRecoveryRates = await fetchTargetRecoveryRatesByUser(
      client,
      758,
    );

    expect(targetRecoveryRates[0]).toEqual(object1);
    expect(targetRecoveryRates[1]).toEqual(object2);
  });
});

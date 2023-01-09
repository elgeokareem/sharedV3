import { describe, expect, test } from '@jest/globals';

import {
  createClient,
  createClientMutation,
} from '../../../shared/tests/graphql';

import {
  fetchTargetRecoveryRatesByUser,
  updateManyTargetRecoveryRates,
} from '../services';

describe('Target Recovery Rate Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

  const client = createClient(endpoint, token);

  const mutationClient = createClientMutation(endpoint, token);

  const updateInput = {
    client: mutationClient,
    targetRecoveryRate: '30',
    updateBranches: [1],
    clientId: '201883',
    updateDurations: ['MTD', 'YTD'],
    userId: 758,
  };

  test('Fetch Target Recovery Rate By User Length', async () => {
    const targetRecoveryRates = await fetchTargetRecoveryRatesByUser(
      client,
      758,
    );

    expect(targetRecoveryRates.length).toBe(12);
  });

  test('Update Target Recovery Rate for userId: 758, clientId: 201833, branchId: 1', async () => {
    const updateRecoveryRates = await updateManyTargetRecoveryRates(
      updateInput,
    );

    expect(updateRecoveryRates?.data?.updateTargetRecoveryRates?.count).toBe(2);
  });
});

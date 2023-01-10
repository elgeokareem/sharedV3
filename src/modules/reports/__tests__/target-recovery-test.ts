import { describe, expect, test } from '@jest/globals';

import {
  createClient,
  createClientMutation,
} from '../../../shared/tests/graphql';

import {
  // createManyTargetRecoveryRates,
  fetchTargetRecoveryRatesByUser,
  updateManyTargetRecoveryRates,
} from '../services';

describe('Target Recovery Rate Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

  const client = createClient(endpoint, token);

  const mutationClient = createClientMutation(endpoint, token);

  // const data = [
  //   {
  //     branchId: 1,
  //     clientId: '228298',
  //     createdAt: '2023-01-09T20:48:02.023Z',
  //     duration: 'MTD',
  //     targetRecoveryRate: 20,
  //     updatedAt: '2023-01-09T20:48:02.023Z',
  //     userId: 758,
  //   },
  //   {
  //     branchId: 1,
  //     clientId: '228298',
  //     createdAt: '2023-01-09T20:48:02.023Z',
  //     duration: 'YTD',
  //     targetRecoveryRate: 20,
  //     updatedAt: '2023-01-09T20:48:02.023Z',
  //     userId: 758,
  //   },
  // ];

  const updateInput = {
    targetRecoveryRate: '50',
    updateBranches: [1],
    clientId: '228298',
    updateDurations: ['MTD'],
    userId: 758,
  };

  // test('Create 2 Target Recovery Rate for userId: 758, clientId: 228298, branchId: 1, MTD/YTD at 20', async () => {
  //   const createRecoveryRates = await createManyTargetRecoveryRates(
  //     mutationClient,
  //     data,
  //   );

  //   expect(createRecoveryRates?.data?.createTargetRecoveryRates?.count).toBe(2);
  // });

  test('Fetch Target Recovery Rate By User', async () => {
    const targetRecoveryRates = await fetchTargetRecoveryRatesByUser(
      client,
      758,
    );

    expect(targetRecoveryRates[0]?.targetRecoveryRate).toBe(50);
  });

  test('Update Target Recovery Rate', async () => {
    const updateRecoveryRates = await updateManyTargetRecoveryRates(
      mutationClient,
      updateInput,
    );

    expect(updateRecoveryRates?.data?.updateTargetRecoveryRates?.count).toBe(1);
  });
});

import { describe, expect, test } from '@jest/globals';

import {
  fetchMissedRepossessions,
} from '../overview-services';
import { createClient } from '../../../shared/tests/graphql';

describe('Branch Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

  const gqlClient = createClient(endpoint, token);

  const startDate = '2022-11-01T05:00:00Z';
  const endDate = '2022-12-01T04:59:59Z';

  const rdnStartDate = '2022-11-01T08:00:00Z';
  const rdnEndDate = '2022-12-01T07:59:59Z';
  const rdnPreviousStartDate = '2021-11-01T08:00:00Z';
  const rdnPreviousEndDate = '2021-12-01T07:59:59Z';

  test('Fetches all missed repossessions for given time frame', async () => {
    const missedRepo = await fetchMissedRepossessions(
      gqlClient,
      '2022-12-01T07:00:00Z',
    '2023-01-01T06:59:59Z',
    '2021-12-01T07:00:00Z',
    '2022-01-01T06:59:59Z',
    1
    );
    expect(missedRepo).toBe(21);
  });
});

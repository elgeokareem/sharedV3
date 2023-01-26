import { describe, expect, test } from '@jest/globals';

import { fetchOverviewStats } from '../services';

import { createClient } from '../../../shared/tests/graphql';

describe('Overview Stats Test', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzQ3NDMzNTMsImV4cCI6MTY3NzMzNTM1M30.MHuTL7H-TuWjvr_50ovu3eGuaQQ63LDy7JUoSsiDREU';

  const input = {
    client: createClient(endpoint, token),
    startDate: '2022-12-01T05:00:00Z',
    endDate: '2023-01-01T04:59:59Z',
    previousStartDate: '2021-12-01T05:00:00Z',
    previousEndDate: '2022-01-01T04:59:59Z',
    rdnStartDate: '2022-12-01T07:00:00Z',
    rdnEndDate: '2023-01-01T06:59:59Z',
    rdnPreviousStartDate: '2021-12-01T07:00:00Z',
    rdnPreviousEndDate: '2022-01-01T06:59:59Z',
  };

  test('Get overview stats', async () => {
    const overviewStats = await fetchOverviewStats(input);

    expect(overviewStats.currentAssignments).toBe(4039);
    expect(overviewStats.previousAssignments).toBe(3734);
    expect(overviewStats.currentRepossessions).toBe(1252);
    expect(overviewStats.previousRepossessions).toBe(1007);
    expect(overviewStats.currentMissedRepossessions).toBe(190);
    expect(overviewStats.previousMissedRepossessions).toBe(30);
  });
});

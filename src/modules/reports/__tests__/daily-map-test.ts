import { describe, expect, test } from '@jest/globals';

import { fetchDailyMap } from '../services';

import { createClient } from '../../../shared/tests/graphql';

describe('Daily Map Data Test', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzQ3NDMzNTMsImV4cCI6MTY3NzMzNTM1M30.MHuTL7H-TuWjvr_50ovu3eGuaQQ63LDy7JUoSsiDREU';

  const client = createClient(endpoint, token);

  const startDate = '2023-01-25T14:00:00Z';
  const endDate = '2023-01-26T13:59:59Z';

  test('Fetch Total Repossessions from 01/25/2023 9AM Eastern to 01/26/2023 8:59:59AM Eastern', async () => {
    const { totalRepossessions } = await fetchDailyMap(
      client,
      startDate,
      endDate,
    );

    expect(totalRepossessions?.length).toBe(70);
  });

  test('Fetch Total Spotted from 01/25/2023 9AM Eastern to 01/26/2023 8:59:59AM Eastern', async () => {
    const { totalSpotted } = await fetchDailyMap(client, startDate, endDate);

    expect(totalSpotted?.length).toBe(37);
  });

  test('Fetch Spotted Not Secured from 01/25/2023 9AM Eastern to 01/26/2023 8:59:59AM Eastern', async () => {
    const { spottedNotSecured } = await fetchDailyMap(
      client,
      startDate,
      endDate,
    );

    expect(spottedNotSecured?.length).toBe(14);
  });
});

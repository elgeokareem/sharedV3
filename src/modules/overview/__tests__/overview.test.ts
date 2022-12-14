import { describe, expect, test } from '@jest/globals';
import { fetchMissedRepossessions } from '../overview-services';
import { createClient } from '../../../shared/graphql';

describe('Branch Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';
  const gqlClient = createClient(endpoint, token);
  const startDate = '2022-12-01 07:00:00';
  const endDate = '2022-12-31 07:00:00';
  const previousStartDate = '2021-12-01 07:00:00';
  const previousEndDate = '2021-12-31 07:00:00';

  test('it fetches all the branches', async () => {
    const missedRepos = await fetchMissedRepossessions(
      gqlClient,
      startDate,
      endDate,
      previousStartDate,
      previousEndDate,
    );

    expect(missedRepos?.current?.length).toBe(64);
    expect(missedRepos?.previous?.length).toBe(56);
    expect(true).toBeTruthy();
  });

  test('it fetches all the branches, filtered by Insight branch', async () => {
    // const missedReposWithBranchFiltering = await fetchMissedRepossessions(
    //   gqlClient,
    //   startDate,
    //   endDate,
    //   previousStartDate,
    //   previousEndDate,
    //   1,
    // );
    // expect(missedReposWithBranchFiltering.length).toBe(23);
    // expect(true).toBeTruthy();
  });
});

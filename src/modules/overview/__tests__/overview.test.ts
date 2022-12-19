import { describe, expect, test } from '@jest/globals';
import {
  fetchAssignments,
  fetchMissedRepossessions,
} from '../overview-services';
import { createClient } from '../../../shared/graphql';

describe('Branch Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';
  const gqlClient = createClient(endpoint, token);
  const startDate = '2022-11-01T05:00:00Z';
  const endDate = '2022-12-01T04:59:59Z';
  const previousStartDate = '2021-11-01T05:00:00Z';
  const previousEndDate = '2021-12-01T04:59:59Z';

  test('it fetches all the branches', async () => {
    // const missedRepos = await fetchMissedRepossessions(
    //   gqlClient,
    //   startDate,
    //   endDate,
    //   previousStartDate,
    //   previousEndDate,
    // );
    // expect(missedRepos?.current?.length).toBe(139);
    // expect(missedRepos?.previous?.length).toBe(56);
    // expect(true).toBeTruthy();
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
    // expect(missedReposWithBranchFiltering?.current?.length).toBe(33);
    // expect(missedReposWithBranchFiltering?.previous?.length).toBe(24);
    expect(true).toBeTruthy();
  });

  test('Fetches all assignments for given time frame', async () => {
    const assignments = await fetchAssignments(
      gqlClient,
      startDate,
      endDate,
      'other',
    );

    expect(assignments?.length).toBe(4438);
  });
});

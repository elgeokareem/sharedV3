import { describe, expect, test } from '@jest/globals';
import {
  fetchAggregateAssignments,
  fetchAggregateMissedRepossessions,
  fetchAssignments,
  fetchMissedRepossessions,
  fetchRepossessions,
} from '../overview-services';
import { createClient } from '../../../shared/graphql';

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
    const missedRepossessions = await fetchAggregateMissedRepossessions(
      gqlClient,
      rdnStartDate,
      rdnEndDate,
    );

    const lastMissedRepossessions = await fetchAggregateMissedRepossessions(
      gqlClient,
      rdnPreviousStartDate,
      rdnPreviousEndDate,
    );

    expect(missedRepossessions).toBe(139);
    expect(lastMissedRepossessions).toBe(21);
  });

  test('it fetches all the branches', async () => {
    const missedRepos = await fetchMissedRepossessions(
      gqlClient,
      startDate,
      endDate,
      rdnPreviousStartDate,
      rdnPreviousEndDate,
    );
    expect(missedRepos?.current?.length).toBe(139);
    expect(missedRepos?.previous?.length).toBe(21);
    expect(true).toBeTruthy();
  });

  test('it fetches all the branches, filtered by Insight branch', async () => {
    const missedReposWithBranchFiltering = await fetchMissedRepossessions(
      gqlClient,
      startDate,
      endDate,
      rdnPreviousStartDate,
      rdnPreviousEndDate,
      1,
    );
    expect(missedReposWithBranchFiltering?.current?.length).toBe(70);
    expect(missedReposWithBranchFiltering?.previous?.length).toBe(7);
    expect(true).toBeTruthy();
  });

  test('Fetches all assignments for given time frame', async () => {
    const aggregateAssignments = await fetchAggregateAssignments(
      gqlClient,
      startDate,
      endDate,
    );

    const assignments = await fetchAssignments(gqlClient, startDate, endDate);

    expect(assignments?.length).toBe(4438);
    expect(aggregateAssignments).toBe(4438);
  });

  test('Fetches all repossessions for given time frame', async () => {
    const aggregateRepossessions = await fetchRepossessions(
      gqlClient,
      rdnStartDate,
      rdnEndDate,
      'aggregate',
    );

    const repossessions = await fetchRepossessions(
      gqlClient,
      rdnStartDate,
      rdnEndDate,
      'other',
    );

    expect(repossessions?.length).toBe(1163);
    expect(aggregateRepossessions).toBe(1163);
  });
});

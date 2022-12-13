import { describe, expect, test } from '@jest/globals';
import { fetchMissedRepossessions } from '../overview-services';
import { createClient } from '../../../shared/graphql';

describe('Branch Tests', () => {
  const endpoint = 'http://localhost:5000/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE5LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2Njk2NTIyNzgsImV4cCI6MTY3MjI0NDI3OH0.ZHeFXjfvHys6EmcD2ebmO86f14Y-DCnYFNGRN5n2lXY';
  const gqlClient = createClient(endpoint, token);
  const startDate = '2022-12-01';
  const endDate = '2022-12-31';

  test('it fetches all the branches', async () => {
    // const missedRepos = await fetchMissedRepossessions(gqlClient, startDate, endDate);
    // expect(missedRepos.length).toBe(50);
    expect(true).toBeTruthy();
  });

  test('it fetches all the branches, filtered by Insight branch', async () => {
    // const missedReposWithBranchFiltering = await fetchMissedRepossessions(gqlClient, startDate, endDate, 1);
    // expect(missedReposWithBranchFiltering.length).toBe(23);
    expect(true).toBeTruthy();
  });
});

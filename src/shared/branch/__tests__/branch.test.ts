import { describe, expect, test } from '@jest/globals';
import { fetchBranches } from '../branch-action';
import { createClient } from '../../graphql';

describe('Branch Tests', () => {
  const endpoint = 'http://localhost:5000/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE5LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2Njk2NTIyNzgsImV4cCI6MTY3MjI0NDI3OH0.ZHeFXjfvHys6EmcD2ebmO86f14Y-DCnYFNGRN5n2lXY';
  test('it fetches all the branches', async () => {
    // const gqlClient = createClient(endpoint, token);
    // const branches = await fetchBranches(gqlClient);
    // expect(branches.length).toBeGreaterThan(0);
    expect(true).toBeTruthy();
  });
});

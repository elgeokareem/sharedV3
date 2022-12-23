import { describe, expect, test } from '@jest/globals';

import {
  fetchMissedRepossessions, fetchReopenCases,
} from '../services';
import { createClient } from '../../../shared/tests/graphql';
import { fetchCasesWithLog } from '../../../shared/cases/actions';
import { Case, CASE_STATUSES } from '../../../shared/types';
import { getMostRecentOpenDate } from '../../../shared/cases/utils';

describe('Branch Tests', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

  const gqlClient = createClient(endpoint, token);

  const rdnStartDate = '2022-12-01T00:00:00+00:00';
  const rdnEndDate = '2022-12-31T23:59:59+00:00';
  const rdnPreviousStartDate = '2021-12-01T00:00:00+00:00';
  const rdnPreviousEndDate = '2021-12-31T23:59:59+00:00';

  test('Fetches all missed repossessions for given time frame', async () => {
    const missedRepo = await fetchMissedRepossessions(
      gqlClient,
      rdnStartDate,
      rdnEndDate,
      rdnPreviousStartDate,
      rdnPreviousEndDate,
    );
    expect(missedRepo).not.toBe(null);
    console.log('missedRepo:', missedRepo);
    const reopenCases = await fetchReopenCases(gqlClient, missedRepo.current);
    console.log('reopenCases:', reopenCases);
    expect(reopenCases).not.toBe(null);
  });


  test('Was Case Reopen', async () => {

    const mostRecentOpenDate1 = '2021-12-01T07:00:00Z';
    const case1: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.closed, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.open, createdAt: mostRecentOpenDate1 },
      ],
    };

    const case2: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.open, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.closed, createdAt: '2021-12-01T07:00:00Z' },
      ],
    };

    const mostRecentOpenDate3 = '2021-12-02T07:00:00Z';
    const case3: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.pending_on_hold, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.open, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.pending_on_hold, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.open, createdAt: mostRecentOpenDate3 },
      ],
    };

    const r1 = getMostRecentOpenDate(case1 as Case);
    expect(r1).toBe(mostRecentOpenDate1);
    const r2 = getMostRecentOpenDate(case2 as Case);
    expect(r2).toBe(null);
    const r3 = getMostRecentOpenDate(case3 as Case);
    expect(r3).toBe(mostRecentOpenDate3);

  });
});

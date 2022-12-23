import { describe, expect, test } from '@jest/globals';

import {
  fetchMissedRepossessions, fetchReopenCases,
} from '../services';
import { createClient } from '../../../shared/tests/graphql';
import { fetchCasesWithLog } from '../../../shared/cases/actions';
import { Case, CASE_STATUSES } from '../../../shared/types';
import { wasCaseReopen } from '../../../shared/cases/utils';

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

    const variables = {
      'where': {
        'caseId': {
          'in': [
            '2116626576',
            '2116626538',
          ],
        },
      },
    };
    const cases = await fetchCasesWithLog(gqlClient, variables);
    // console.log('cases:', cases);
    const missedRepo = await fetchMissedRepossessions(
      gqlClient,
      '2022-12-01T07:00:00Z',
      '2023-01-01T06:59:59Z',
      '2021-12-01T07:00:00Z',
      '2022-01-01T06:59:59Z',
      1,
    );
    console.log('missedRepo:', missedRepo);
    expect(missedRepo).not.toBe(null);

    const reopenCases = await fetchReopenCases(gqlClient, missedRepo.current);
    //
    console.log('reopenCases:', reopenCases);
    expect(reopenCases).not.toBe(null);
  });


  test('Was Case Reopen', async () => {

    const case1: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.closed, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.open, createdAt: '2021-12-01T07:00:00Z' },
      ],
    };

    const case3: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.pending_on_hold, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.open, createdAt: '2021-12-01T07:00:00Z' },
      ],
    };

    const case2: Partial<Case> = {
      RDNCaseLog: [
        { status: CASE_STATUSES.open, createdAt: '2021-12-01T07:00:00Z' },
        { status: CASE_STATUSES.closed, createdAt: '2021-12-01T07:00:00Z' },
      ],
    };

    const r1 = wasCaseReopen(case1 as Case);
    expect(r1).toBe(true);
    const r2 = wasCaseReopen(case2 as Case);
    expect(r2).toBe(false);
    const r3 = wasCaseReopen(case3 as Case);
    expect(r3).toBe(true);

  });
});

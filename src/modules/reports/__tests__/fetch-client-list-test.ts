import { describe, expect, test } from '@jest/globals';

import { createClient } from '../../../shared/tests/graphql';
import { fetchClientList } from '../services';

describe('Client List Test', () => {
  const endpoint = 'https://api.insightt.io/graphql';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzU4LCJkYk5hbWUiOiJycmFfZGIiLCJpYXQiOjE2NzEwMTcxNzEsImV4cCI6MTY3MzYwOTE3MX0.pU7z0AuAH5-nPO4yKRfNEYFskfH-8g0kqYYiwjFXLLU';

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

  test('Get Data For Client List', async () => {
    const clientList = await fetchClientList(input);

    expect(clientList.currentAssignments?.length).toBe(3996);
    expect(clientList.previousAssignments?.length).toBe(3732);
    expect(clientList.currentRepossessions?.length).toBe(1236);
    expect(clientList.previousRepossessions?.length).toBe(1007);
    expect(clientList.currentMissedRepossessions?.length).toBe(190);
    expect(clientList.previousMissedRepossessions?.length).toBe(30);
  });
});

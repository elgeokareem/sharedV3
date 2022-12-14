import moment = require('moment-timezone');

import { fetchBranches } from '../../shared/branch/branch-action';
import { CASE_STATUSES, GraphQLClient } from '../../shared/types';

import {
  DATETIME_FORMAT,
  ERROR_MESSAGES,
  IMPOUND_ORDER_TYPES,
  INVOLUNTARY_ORDER_TYPES,
  VOLUNTARY_ORDER_TYPES,
} from '../../shared/constants';

import { MISSED_REPOSSESSIONS_QUERY } from './queries';

export const fetchMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  previousStartDate: string,
  previousEndDate: string,
  branchId = 0,
) => {
  if (
    !moment(startDate, DATETIME_FORMAT, true).isValid() &&
    !moment(previousStartDate, DATETIME_FORMAT, true).isValid()
  ) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (
    !moment(endDate, DATETIME_FORMAT, true).isValid() &&
    !moment(previousEndDate, DATETIME_FORMAT, true).isValid()
  ) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const rdnBranchNames: string[] = [];
  if (branchId !== 0) {
    const branches = await fetchBranches(client);
    const branch = branches.find((b) => b.id === branchId);

    if (!branch) {
      throw new Error(ERROR_MESSAGES.branchNotFound);
    }

    branch.subBranches.forEach((subBranch) => {
      rdnBranchNames.push(subBranch.name);
    });
  }

  const closeStatuses = [CASE_STATUSES.closed, CASE_STATUSES.pending_close];
  const holdStatuses = [CASE_STATUSES.onHold, CASE_STATUSES.pending_on_hold];

  const getMissedRepossessionVariables = (start: string, end: string) => ({
    AND: [
      {
        OR: [
          {
            status: { in: closeStatuses },
            close_date: { gte: start, lte: end },
          },
          {
            status: { in: holdStatuses },
            hold_date: { gte: start, lte: end },
          },
        ],
      },
      {
        OR: [
          {
            orderType: { in: INVOLUNTARY_ORDER_TYPES },
            spottedDate: { not: null },
          },
          {
            orderType: {
              in: [...VOLUNTARY_ORDER_TYPES, ...IMPOUND_ORDER_TYPES],
            },
          },
        ],
      },
    ],
  });

  const variables: Record<string, any> = {
    where1: getMissedRepossessionVariables(startDate, endDate),
    where2: getMissedRepossessionVariables(previousStartDate, previousEndDate),
    orderBy: [{ caseId: 'desc' }],
  };

  if (branchId !== 0) {
    variables.where1.AND.push({
      vendorBranchName: { in: rdnBranchNames },
    });
    variables.where2.AND.push({
      vendorBranchName: { in: rdnBranchNames },
    });
  }

  const response = await client.query({
    query: MISSED_REPOSSESSIONS_QUERY,
    variables,
  });

  return {
    current: response?.current,
    previous: response?.previous,
  };
};

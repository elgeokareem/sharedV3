import moment = require('moment-timezone');

import { fetchBranches } from '../../shared/branch/branch-action';
import { GraphQLClient } from '../../shared/types';

import { DATETIME_FORMAT, ERROR_MESSAGES } from '../../shared/constants';

import {
  AGGREGATE_ASSIGNMENTS_QUERY,
  MISSED_REPOSSESSIONS_QUERY,
} from './queries';
import { MissedRepossessionsResult } from './types';

export const fetchMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  previousStartDate: string,
  previousEndDate: string,
  branchId = 0,
): Promise<MissedRepossessionsResult> => {
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

  const getMissedRepossessionVariables = (start: string, end: string) => ({
    createdAt: { gte: start, lte: end },
  });

  const variables: Record<string, any> = {
    where1: getMissedRepossessionVariables(startDate, endDate),
    where2: getMissedRepossessionVariables(previousStartDate, previousEndDate),
    orderBy: [{ caseId: 'desc' }],
  };

  if (branchId !== 0) {
    variables.where1.case = {
      is: { vendorBranchName: { in: rdnBranchNames } },
    };
    variables.where2.case = {
      is: { vendorBranchName: { in: rdnBranchNames } },
    };
  }

  const response = await client.query({
    query: MISSED_REPOSSESSIONS_QUERY,
    variables,
  });
  console.log('response', response);
  return {
    current: response?.current,
    previous: response?.previous,
  };
};

export const fetchAggregateAssignments = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
) => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: { orderDate: { gte: startDate, lte: endDate } },
  };

  const response = await client.query({
    query: AGGREGATE_ASSIGNMENTS_QUERY,
    variables,
  });

  return response?.assignments?._count?.caseId;
};

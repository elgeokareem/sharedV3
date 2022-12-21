import moment = require('moment-timezone');

import { Case, GraphQLClient } from '../../shared/types';
import { fetchBranches } from '../../shared/branch/branch-action';

import {
  ACCEPTED_RDN_STATUSES,
  RDN_STATUSES_OBJECT,
  DATETIME_FORMAT,
  ERROR_MESSAGES,
} from '../../shared/constants';

import {
  AGGREGATE_ASSIGNMENTS_QUERY,
  AGGREGATE_MISSED_REPOSSESSIONS_QUERY,
  AGGREGATE_REPOSSESSIONS_QUERY,
  ASSIGNMENTS_QUERY,
  MISSED_REPOSSESSIONS_QUERY,
  REOPEN_AND_REPOSSESSED_CASES_QUERY,
  REPOSSESSIONS_QUERY,
} from './queries';

import { MissedRepossessionsResult } from './types';
import { version } from '../../shared/utils';
import { removeDuplicatedVins } from '../reports/reports-helpers';
import { fetchUsers } from 'shared/users/users-action';

export const fetchAggregateMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
): Promise<number> => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: { createdAt: { gte: startDate, lte: endDate } },
  };

  const response = await client.query({
    query: AGGREGATE_MISSED_REPOSSESSIONS_QUERY,
    variables,
  });

  return response?.data?.missedRepossesions?._count?.caseId;
};

export const fetchMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  previousStartDate: string,
  previousEndDate: string,
  branchId = 0,
): Promise<MissedRepossessionsResult> => {
  console.log('fetchMissedRepossessions:', version());
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

  let rdnBranchNames: string[] | null = [];
  if (branchId !== 0 && branchId !== -1) {
    const branches = await fetchBranches(client);
    const branch = branches.find((b) => b.id === branchId);

    if (!branch) {
      throw new Error(ERROR_MESSAGES.branchNotFound);
    }

    branch.subBranches.forEach((subBranch) => {
      rdnBranchNames!.push(subBranch.name);
    });
  }

  if (branchId === -1) {
    rdnBranchNames = null;
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

  const current = response?.data?.current ?? [];
  const previous = response?.data?.previous ?? [];

  // Add users to the cases
  const users = await fetchUsers(client);
  const currentWithUsers = current.map((c: { case: { spotterId: number } }) => {
    const user = users.find((u) => u.id === c.case?.spotterId);

    if (!user) {
      return { ...c };
    }

    return { ...c, user };
  });

  return {
    current: currentWithUsers,
    previous: previous,
  };
};

export const fetchReopenAndRepossessedCases = async (
  client: GraphQLClient,
  vins: string[],
  earliestDate: string,
): Promise<any> => {
  // ): Promise<ReopenAndRepossessedCasesResult> => {
  const variables = {
    where: {
      vin: { in: vins },
      status: {
        in: [RDN_STATUSES_OBJECT.open, RDN_STATUSES_OBJECT.repossessed],
      },
      originalOrderDate: { gte: earliestDate },
    },
  };

  const response = await client.query({
    query: REOPEN_AND_REPOSSESSED_CASES_QUERY,
    variables,
  });

  const cases = response?.data?.rDNCases;

  const casesFiltered = removeDuplicatedVins(cases);

  return casesFiltered;
};

export const fetchAggregateAssignments = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  clientId?: string,
): Promise<number> => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: {
      orderDate: { gte: startDate, lte: endDate },
      status: { in: [...ACCEPTED_RDN_STATUSES] },
    },
  };

  if (clientId) {
    variables.where.lenderClientId = { equals: clientId };
  }

  const response = await client.query({
    query: AGGREGATE_ASSIGNMENTS_QUERY,
    variables,
  });

  return response?.data?.assignments?._count?.caseId;
};

export const fetchAssignments = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
): Promise<Case[]> => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: {
      orderDate: { gte: startDate, lte: endDate },
      status: { in: [...ACCEPTED_RDN_STATUSES] },
    },
  };

  const response = await client.query({
    query: ASSIGNMENTS_QUERY,
    variables,
  });

  return response?.data?.assignments;
};

export const fetchAggregateRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  clientId?: string,
): Promise<number> => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: { rdnRepoDate: { gte: startDate, lte: endDate } },
  };

  if (clientId) {
    variables.where.lenderClientId = { equals: clientId };
  }

  const response = await client.query({
    query: AGGREGATE_REPOSSESSIONS_QUERY,
    variables,
  });

  return response?.data?.repossessions?._count?.caseId;
};

export const fetchRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
): Promise<Case[]> => {
  if (!moment(startDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATETIME_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.endDateInvalid);
  }

  const variables: Record<string, any> = {
    where: { rdnRepoDate: { gte: startDate, lte: endDate } },
  };

  const response = await client.query({
    query: REPOSSESSIONS_QUERY,
    variables,
  });

  return response?.data?.repossessions;
};

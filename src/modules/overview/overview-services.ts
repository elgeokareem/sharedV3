import moment = require('moment-timezone');

import { Case, CASE_STATUSES, GraphQLClient, MissedRepossession } from '../../shared/types';
import { fetchBranches } from '../../shared/branch/branch-action';

import {
  ACCEPTED_RDN_STATUSES,
  DATETIME_FORMAT,
  ERROR_MESSAGES,
  MISSED_REPOSSESSED_STATUSES,
  RDN_STATUSES_OBJECT,
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
import { fetchCases, fetchCasesWithLog } from '../../shared/cases/actions';
import { wasCaseReopen } from '../../shared/cases/utils';

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

  if (branchId < -1) {
    throw new Error(ERROR_MESSAGES.branchNotFound);
  }

  // Date Filters
  const variables: Record<string, any> = {
    where1: ({ createdAt: { gte: startDate, lte: endDate } }),
    where2: ({ createdAt: { gte: previousStartDate, lte: previousEndDate } }),
    orderBy: [{ caseId: 'desc' }],
  };

  if (branchId !== 0) {
    const rdnBranchNames: (string | null)[] = [];
    if (branchId > 0) {
      const branches = await fetchBranches(client);
      const branch = branches.find((b) => b.id === branchId);

      if (!branch) {
        throw new Error(ERROR_MESSAGES.branchNotFound);
      }

      branch.subBranches.forEach((subBranch) => {
        rdnBranchNames.push(subBranch.name);
      });
    }

    if (branchId === -1) {
      rdnBranchNames.push(null);
    }

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
  return {
    current,
    previous,
  };
};

export const fetchReopenCases = async (
  client: GraphQLClient,
  missedRepossessions: MissedRepossession[],
): Promise<Case[]> => {


  // Calculate Reopen Cases:
  // - Cases that had at some point a MISSED REPO STATUS, and later were OPEN or REOPEN
  const caseIds = missedRepossessions.map((mr) => mr.case.caseId);
  const reopenCaseVariables: Record<string, any> = {
    'where': { 'caseId': { 'in': caseIds } },
    'rdnCaseLogOrderBy': { 'createdAt': 'asc' }, // We order by createdAt to get the first status first
  };
  const casesWithLog = await fetchCasesWithLog(client, reopenCaseVariables);
  const reopenCases = casesWithLog.filter(wasCaseReopen);


  // Calculate Following Cases
  //   - Query cases with the same VINS and orderDate (firstOfThe Month - EndOfTheMonth+1 week)
  //   - For each Missed Repo Case, search for a matching VIN
  const vins = missedRepossessions.map((mr) => mr.case.vin);
  const followingCasesVariables = { where: { vin: { in: vins } } };
  const cases = await fetchCases(client, followingCasesVariables);
  const maybeFollowingCasesMap: Record<string, Case[]> = {};
  cases.forEach((c) => {
    const listOfCasesByVin = maybeFollowingCasesMap[c.vin];
    if (listOfCasesByVin) {
      listOfCasesByVin.push(c);
    } else {
      maybeFollowingCasesMap[c.vin] = [c];
    }
  });
  const followingCases: Case[] = [];
  missedRepossessions.forEach((mr) => {
    const maybeFollowingCases = maybeFollowingCasesMap[mr.case.vin];
    // No cases with this VIN. Which is weird, but we can't do anything about it
    if (maybeFollowingCases === undefined) return;
    // We check for:
    // - Higher CaseId (a newer case)
    // - Same Client Name
    // - Order Date between first of the Month and end of the month + 1 week

    maybeFollowingCases.forEach((c) => {
      if (Number(c.caseId) < Number(mr.case.caseId)) return;
      if (c.lenderClientId !== mr.case.lenderClientId) return;
      if (moment(c.originalOrderDate).isBetween(
        moment(mr.case.originalOrderDate).startOf('month'),
        moment(mr.case.originalOrderDate).endOf('month').add(1, 'week'),
      )
      ) {
        followingCases.push(c);
      }
    });
  });

  return reopenCases.concat(followingCases);
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

import moment = require('moment-timezone');

import {
  Case,
  GraphQLClient,
  MISSED_REPOSSESSION_REOPEN_CASE_TYPE,
  MissedRepossession,
  MissedRepossessionReopenCase,
} from '../../shared/types';

import {
  ACCEPTED_RDN_STATUSES,
  DATETIME_FORMAT,
  ERROR_MESSAGES,
} from '../../shared/constants';

import {
  AGGREGATE_ASSIGNMENTS_QUERY,
  AGGREGATE_MISSED_REPOSSESSIONS_QUERY,
  AGGREGATE_REPOSSESSIONS_QUERY,
  ASSIGNMENTS_QUERY,
  MISSED_REPOSSESSIONS_QUERY,
  REPOSSESSIONS_QUERY,
} from './queries';

import { MissedRepossessionsResult, OverviewStatsInput } from './types';

import { version } from '../../shared/utils';
import { getMostRecentOpenDate } from '../../shared/cases/utils';
import { fetchBranches } from '../../shared/branch/branch-action';
import { fetchCases, fetchCasesWithLog } from '../../shared/cases/actions';

export const fetchAggregateMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  branchId = 0,
  clientId?: string,
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

  if (clientId) {
    variables.where.case = {
      is: { lenderClientId: { equals: clientId } },
    };
  }

  if (branchId !== 0) {
    if (branchId > 0) {
      const rdnBranchNames: string[] = [];
      const branches = await fetchBranches(client);
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) {
        throw new Error(ERROR_MESSAGES.branchNotFound);
      }
      branch.subBranches.forEach((subBranch) => {
        rdnBranchNames.push(subBranch.name);
      });
      variables.where.case = {
        is: { vendorBranchName: { in: rdnBranchNames } },
      };
    }

    if (branchId === -1) {
      variables.where.case = {
        is: { vendorBranchName: null },
      };
    }
  }

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
    where1: { createdAt: { gte: startDate, lte: endDate } },
    where2: { createdAt: { gte: previousStartDate, lte: previousEndDate } },
    orderBy: [{ caseId: 'desc' }],
  };

  if (branchId !== 0) {
    if (branchId > 0) {
      const rdnBranchNames: string[] = [];
      const branches = await fetchBranches(client);
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) {
        throw new Error(ERROR_MESSAGES.branchNotFound);
      }
      branch.subBranches.forEach((subBranch) => {
        rdnBranchNames.push(subBranch.name);
      });
      variables.where1.case = {
        is: { vendorBranchName: { in: rdnBranchNames } },
      };
      variables.where2.case = {
        is: { vendorBranchName: { in: rdnBranchNames } },
      };
    }

    if (branchId === -1) {
      variables.where1.case = {
        is: { vendorBranchName: null },
      };
      variables.where2.case = {
        is: { vendorBranchName: null },
      };
    }
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
): Promise<MissedRepossessionReopenCase[]> => {
  // Calculate Reopen Cases:
  // - Cases that had at some point a MISSED REPO STATUS, and later were OPEN or REOPEN
  const caseIds = missedRepossessions.map((mr) => mr.case.caseId);
  const reopenCaseVariables: Record<string, any> = {
    where: { caseId: { in: caseIds } },
    rdnCaseLogOrderBy: { createdAt: 'asc' }, // We order by createdAt to get the first status first
  };
  const casesWithLog = await fetchCasesWithLog(client, reopenCaseVariables);
  const reopenCases = casesWithLog.filter((c) => {
    return getMostRecentOpenDate(c) !== null;
  });

  // Calculating missed Date for Reopen Cases
  const missedDateMap: Record<string, string> = {};
  missedRepossessions.forEach((missedRepossession) => {
    const record = missedDateMap[missedRepossession.case.caseId];
    if (record === undefined) {
      missedDateMap[missedRepossession.case.caseId] =
        missedRepossession.createdAt;
    } else {
      const oldestDate = moment.min(
        moment(record),
        moment(missedRepossession.createdAt),
      );
      missedDateMap[missedRepossession.case.caseId] =
        oldestDate.format(DATETIME_FORMAT);
    }
  });
  const reopenMissedRepossessionCases: MissedRepossessionReopenCase[] = [];
  reopenCases.forEach((reopenCase) => {
    const missedDate = missedDateMap[reopenCase.caseId];
    // THIS SHOULD NEVER HAPPEN. But just in case
    if (missedDate === undefined) {
      throw new Error(ERROR_MESSAGES.missedDateNotFound);
    }
    reopenMissedRepossessionCases.push({
      ...reopenCase,
      reOpenDate: getMostRecentOpenDate(reopenCase),
      missedDate,
      type: MISSED_REPOSSESSION_REOPEN_CASE_TYPE.REOPEN,
    });
  });

  // Calculate Following Cases
  //   - Query cases with the same VINS and orderDate (firstOfThe Month - EndOfTheMonth+1 week)
  //   - For each Missed Repo Case, search for a matching VIN
  const vins = missedRepossessions.map((mr) => mr.case.vin);
  // Cases with these VINS, but excluding the original cases
  const followingCasesVariables = {
    where: { vin: { in: vins }, caseId: { notIn: caseIds } },
  };
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
  const followingCasesMap: Record<string, MissedRepossessionReopenCase> = {};
  missedRepossessions.forEach((mr) => {
    const originalVin = mr.case.vin;
    const maybeFollowingCases = maybeFollowingCasesMap[originalVin];
    // No cases with this VIN. Which is weird, but we can't do anything about it
    if (maybeFollowingCases === undefined) return;
    // We check for:
    // - Higher CaseId (a newer case)
    // - Same Client Name
    // - Order Date between first of the Month and end of the month + 1 week
    maybeFollowingCases.forEach((c) => {
      // this means tha the case is older. So we ignored it
      if (Number(c.caseId) < Number(mr.case.caseId)) return;
      // this means tha the case is for a different Bank. So we ignored it
      if (c.lenderClientId !== mr.case.lenderClientId) return;
      if (
        moment(c.originalOrderDate).isBetween(
          moment(mr.case.originalOrderDate).startOf('month'),
          moment(mr.case.originalOrderDate).endOf('month').add(1, 'week'),
        )
      ) {
        followingCasesMap[c.caseId] = {
          ...c,
          reOpenDate: c.originalOrderDate,
          missedDate: mr.createdAt,
          type: MISSED_REPOSSESSION_REOPEN_CASE_TYPE.FOLLOWING_CASE,
        };
      }
    });
  });

  return reopenMissedRepossessionCases.concat(Object.values(followingCasesMap));
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

// Please DO NOT touch this function, if you want to make modifications, make your own with this being the template.
export const fetchOverviewStats = async (input: OverviewStatsInput) => {
  // Validate all inputted start dates.
  if (!moment(input.startDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.previousStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.rdnStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.rdnPreviousStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  // Validate all inputted end dates.
  if (!moment(input.endDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.previousEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.rdnEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.rdnPreviousEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  const currentAssignments = await fetchAggregateAssignments(
    input.client,
    input.startDate,
    input.endDate,
  );

  const previousAssignments = await fetchAggregateAssignments(
    input.client,
    input.previousStartDate,
    input.previousEndDate,
  );

  const currentRepossessions = await fetchAggregateRepossessions(
    input.client,
    input.rdnStartDate,
    input.rdnEndDate,
  );

  const previousRepossessions = await fetchAggregateRepossessions(
    input.client,
    input.rdnPreviousStartDate,
    input.rdnPreviousEndDate,
  );

  const currentMissedRepossessions = await fetchAggregateMissedRepossessions(
    input.client,
    input.rdnStartDate,
    input.rdnEndDate,
  );

  const previousMissedRepossessions = await fetchAggregateMissedRepossessions(
    input.client,
    input.rdnPreviousStartDate,
    input.rdnPreviousEndDate,
  );

  return {
    currentAssignments,
    previousAssignments,
    currentRepossessions,
    previousRepossessions,
    currentMissedRepossessions,
    previousMissedRepossessions,
  };
};

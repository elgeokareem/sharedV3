import { CASE_STATUSES, GraphQLClient } from '../../shared/types';
import {
  DATE_FORMAT,
  ERROR_MESSAGES,
  IMPOUND_ORDER_TYPES,
  INVOLUNTARY_ORDER_TYPES,
  VOLUNTARY_ORDER_TYPES,
} from '../../shared/constants';
import moment = require('moment-timezone');
import { fetchBranches } from '../../shared/branch/branch-action';
import { MISSED_REPOSSESSIONS_QUERY } from './queries';

export const fetchMissedRepossessions = async (client: GraphQLClient, startDate: string, endDate: string, branchId = 0) => {
  if (!moment(startDate, DATE_FORMAT, true).isValid()) {
    throw new Error(ERROR_MESSAGES.startDateInvalid);
  }

  if (!moment(endDate, DATE_FORMAT, true).isValid()) {
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


  const variables: Record<string, any> = {
    'where': {
      'AND': [
        {
          'OR': [
            {
              'status': { 'in': closeStatuses },
              'originalCloseDate': { 'gte': startDate, 'lte': endDate },
            },
            {
              'status': { 'in': holdStatuses },
              'originalHoldDate': { 'gte': startDate, 'lte': endDate },
            },
          ],
        },
        {
          'OR': [
            {
              'orderType': { 'in': INVOLUNTARY_ORDER_TYPES },
              'spottedDate': { 'not': null },
            },
            {
              'orderType': { 'in': [...VOLUNTARY_ORDER_TYPES, ...IMPOUND_ORDER_TYPES] },
            },
          ],
        },
      ],
    },
    'orderBy': [{ 'caseId': 'desc' }],
  };

  if (branchId !== 0) {
    variables.where.AND.push({
      'vendorBranchName': { 'in': rdnBranchNames },
    });
  }

  const response = await client.query({
    query: MISSED_REPOSSESSIONS_QUERY,
    variables,
  });
  console.log(response.rDNCases);
  return response.rDNCases;

};

import moment from 'moment';

import { GraphQLClient } from './types';

import {
  ASSIGNMENT_COUNT,
  MISSED_REPOSSESSION_COUNT,
  REPOSSESSION_COUNT,
} from './queries';

import {
  ACCEPTED_RDN_STATUSES,
  DATETIME_FORMAT,
  ERROR_MESSAGES,
} from './constants';

export const fetchAssignmentCount = async (
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
    query: ASSIGNMENT_COUNT,
    variables,
  });

  return response?.data?.assignments?._count?.caseId;
};

export const fetchRepossessionCount = async (
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
    query: REPOSSESSION_COUNT,
    variables,
  });

  return response?.data?.repossessions?._count?.caseId;
};

export const fetchMissedRepossessionCount = async (
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
    where: { createdAt: { gte: startDate, lte: endDate } },
  };

  if (clientId) {
    variables.where.case = {
      is: { lenderClientId: { equals: clientId } },
    };
  }

  const response = await client.query({
    query: MISSED_REPOSSESSION_COUNT,
    variables,
  });

  return response?.data?.missedRepossesions?._count?.caseId;
};

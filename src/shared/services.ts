import moment from 'moment';

import { Case, GraphQLClient, MissedRepossession } from './types';

import {
  ASSIGNMENTS_QUERY,
  ASSIGNMENT_COUNT_QUERY,
  MISSED_REPOSSESSION_COUNT_QUERY,
  MISSED_REPOSSESSION_QUERY,
  REPOSSESSIONS_QUERY,
  REPOSSESSION_COUNT_QUERY,
} from './queries';

import {
  ACCEPTED_RDN_STATUSES,
  DATETIME_FORMAT,
  ERROR_MESSAGES,
} from './constants';

export const getAssignmentCount = async (
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
    query: ASSIGNMENT_COUNT_QUERY,
    variables,
  });

  return response?.data?.assignments?._count?.caseId;
};

export const getAssignments = async (
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

export const getRepossessionCount = async (
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
    query: REPOSSESSION_COUNT_QUERY,
    variables,
  });

  return response?.data?.repossessions?._count?.caseId;
};

export const getRepossessions = async (
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

export const getMissedRepossessionCount = async (
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
    query: MISSED_REPOSSESSION_COUNT_QUERY,
    variables,
  });

  return response?.data?.missedRepossesions?._count?.caseId;
};

export const getMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
): Promise<MissedRepossession[]> => {
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
    query: MISSED_REPOSSESSION_QUERY,
    variables,
  });

  return response?.data?.missedRepossessions;
};

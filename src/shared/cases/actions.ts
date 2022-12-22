import { CASES_WITH_LOG_QUERY, CASES_QUERY } from './queries';
import { Case, GraphQLClient } from '../types';

export const fetchCasesWithLog = async (client: GraphQLClient, variables:Record<string, any>): Promise<Case[]> => {
  const response = await client.query({
    query: CASES_WITH_LOG_QUERY,
    variables,
  });
  return response.data.rDNCases;
};

export const fetchCases = async (client: GraphQLClient, variables:Record<string, any>): Promise<Case[]> => {
  const response = await client.query({
    query: CASES_QUERY,
    variables,
  });
  return response.data.rDNCases;
};

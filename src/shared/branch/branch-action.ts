import { BRANCHES_QUERY } from './branch-queries';
import { GraphQLClient } from '../types';
import { Branch } from './types';

export const fetchBranches = async (client: GraphQLClient): Promise<Branch[]> => {
  const response = await client.query({
    query: BRANCHES_QUERY,
  });
  return response.branches;
};

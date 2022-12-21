import { USERS_QUERY } from './users-queries';
import { GraphQLClient } from '../types';
import { User } from './types';

export const fetchUsers = async (client: GraphQLClient): Promise<User[]> => {
  const response = await client.query({
    query: USERS_QUERY,
  });

  return response?.data?.users;
};

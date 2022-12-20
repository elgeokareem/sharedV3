import { GraphQLClient, GraphQLQuery } from '../types';
import { GraphQLClient as GQLClient } from 'graphql-request';


export const createClient = (endpoint: string, token: string): GraphQLClient => {
  const graphQLClient = new GQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return {
    query: async (options: GraphQLQuery) => {
      const response = await graphQLClient.request(options.query, options.variables);
      return {
        data: { ...response },
      };
    },
  };
};



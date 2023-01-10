import {
  GraphQLClient,
  GraphQLClientMutation,
  GraphQLMutation,
  GraphQLQuery,
} from '../types';
import { GraphQLClient as GQLClient } from 'graphql-request';

export const createClient = (
  endpoint: string,
  token: string,
): GraphQLClient => {
  const graphQLClient = new GQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return {
    query: async (options: GraphQLQuery) => {
      const response = await graphQLClient.request(
        options.query,
        options.variables,
      );
      return {
        data: { ...response },
      };
    },
  };
};

export const createClientMutation = (
  endpoint: string,
  token: string,
): GraphQLClientMutation => {
  const graphQLClient = new GQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return {
    mutate: async (options: GraphQLMutation) => {
      const response = await graphQLClient.request(
        options.mutation,
        options.variables,
        options.refetchQueries,
      );
      return {
        data: { ...response },
      };
    },
  };
};

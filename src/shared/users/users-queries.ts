import gql from 'graphql-tag';

export const USERS_QUERY = gql`
  query Users {
    users {
      firstName
      lastName
      avatarUrl
      branchId
      id
    }
  }
`;

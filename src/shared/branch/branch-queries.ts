import gql from 'graphql-tag';

export const BRANCHES_QUERY = gql`
  query Branches{
    branches {
      id
      name
      subBranches {
        id
        name
        zipCodes
      }
    }
  }
`;







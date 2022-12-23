import gql from 'graphql-tag';

export const CASES_WITH_LOG_QUERY = gql`
  query Cases($where: RDNCaseWhereInput, $rdnCaseLogOrderBy: [RDNCaseLogOrderByWithRelationInput!]){
      rDNCases(where: $where) {
        caseId
        vin
        status
        lenderClientId
        RDNCaseLog(orderBy: $rdnCaseLogOrderBy) {
          createdAt
          status
        }
      } 
    }
`;



export const CASES_QUERY = gql`
  query Cases($where: RDNCaseWhereInput){
      rDNCases(where: $where) {
        caseId
        vin
        status
        lenderClientId
      } 
    }
`;









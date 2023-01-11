import gql from 'graphql-tag';

export const CASES_WITH_LOG_QUERY = gql`
  query Cases(
    $where: RDNCaseWhereInput
    $rdnCaseLogOrderBy: [RDNCaseLogOrderByWithRelationInput!]
  ) {
    rDNCases(where: $where) {
      caseId
      vin
      status
      lenderClientId
      lenderClientName
      orderType
      originalOrderDate
      yearMakeModel
      spottedDate
      rdnRepoDate
      repoAddress
      repoLat
      repoLng
      RDNCaseLog(orderBy: $rdnCaseLogOrderBy) {
        createdAt
        status
      }
    }
  }
`;

export const CASES_QUERY = gql`
  query Cases($where: RDNCaseWhereInput) {
    rDNCases(where: $where) {
      caseId
      vin
      status
      orderType
      originalOrderDate
      lenderClientId
      lenderClientName
      yearMakeModel
      spottedDate
      rdnRepoDate
      repoAddress
      repoLat
      repoLng
    }
  }
`;

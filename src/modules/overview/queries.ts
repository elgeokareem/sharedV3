import gql from 'graphql-tag';

export const MISSED_REPOSSESSIONS_QUERY = gql`
  query MissedRepossessions(
    $where1: RDNCaseWhereInput
    $where2: RDNCaseWhereInput
    $orderBy: [RDNCaseOrderByWithRelationInput!]
  ) {
    current: rDNCases(where: $where1, orderBy: $orderBy) {
      caseId
      status
      orderType
      closeDate
      holdDate
      originalOrderDate
      spottedDate
      vendorBranchName
      lenderClientId

      missedRepossession {
        createdAt
      }
    }

    previous: rDNCases(where: $where2, orderBy: $orderBy) {
      caseId
      status
      orderType
      closeDate
      holdDate
      originalOrderDate
      spottedDate
      vendorBranchName
      lenderClientId

      missedRepossession {
        createdAt
      }
    }
  }
`;

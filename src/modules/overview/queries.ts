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
      close_date
      hold_date
      originalOrderDate
      spottedDate
      vendorBranchName
      lender_client_id

      missedRepossession {
        createdAt
      }
    }

    previous: rDNCases(where: $where2, orderBy: $orderBy) {
      caseId
      status
      orderType
      close_date
      hold_date
      originalOrderDate
      spottedDate
      vendorBranchName
      lender_client_id

      missedRepossession {
        createdAt
      }
    }
  }
`;

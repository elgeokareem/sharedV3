import gql from 'graphql-tag';

export const MISSED_REPOSSESSIONS_QUERY = gql`
query MissedRepossessions($where: RDNCaseWhereInput, $orderBy: [RDNCaseOrderByWithRelationInput!]){
  rDNCases(where: $where, orderBy: $orderBy) {
    caseId
    status
    orderType
    originalCloseDate
    originalHoldDate
    originalOrderDate
    spottedDate
    vendorBranchName
    missedRepossession {
      createdAt
    }
  }
}`;

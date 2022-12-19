import gql from 'graphql-tag';

export const MISSED_REPOSSESSIONS_QUERY = gql`
  query MissedRepossessions(
    $where1: MissedRepossessionWhereInput, 
    $where2: MissedRepossessionWhereInput, 
    $orderBy: [MissedRepossessionOrderByWithRelationInput!]){
    current: missedRepossessions(where: $where1, orderBy: $orderBy) {
      createdAt
      case {
        caseId
        status
        orderType
        closeDate
        holdDate
        originalOrderDate
        spottedDate
        vendorBranchName
        lenderClientId
        lenderClientName
      }
    }
    previous: missedRepossessions(where: $where2, orderBy: $orderBy) {
      createdAt
      case {
        caseId
        status
        orderType
        closeDate
        holdDate
        originalOrderDate
        spottedDate
        vendorBranchName
        lenderClientId
        lenderClientName
      }
    }
  }
`;

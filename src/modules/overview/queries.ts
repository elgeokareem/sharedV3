import gql from 'graphql-tag';

export const MISSED_REPOSSESSIONS_QUERY = gql`
  fragment Spotter on User {
    id
    firstName
    lastName
    avatarUrl
    branchId
  }

  fragment MissedRepossessionCase on MissedRepossession {
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
      vin
      yearMakeModel
      spottedAddress
      spottedLat
      spottedLng
      spotter {
        ...Spotter
      }
    }
  }

  query MissedRepossessions(
    $where1: MissedRepossessionWhereInput
    $where2: MissedRepossessionWhereInput
    $orderBy: [MissedRepossessionOrderByWithRelationInput!]
  ) {
    current: missedRepossessions(where: $where1, orderBy: $orderBy) {
      ...MissedRepossessionCase
    }
    previous: missedRepossessions(where: $where2, orderBy: $orderBy) {
      ...MissedRepossessionCase
    }
  }
`;

export const REOPEN_AND_REPOSSESSED_CASES_QUERY = gql`
  query RDNCase($where: RDNCaseWhereInput) {
    rDNCases(where: $where) {
      caseId
      vin
      vinLastEight
      status
      orderType
      closeDate
      holdDate
      originalOrderDate
      spottedDate
      vendorBranchName
      lenderClientId
      lenderClientName
      yearMakeModel
      rdnRepoDate
    }
  }
`;

export const ASSIGNMENTS_QUERY = gql`
  query RDNCases($where: RDNCaseWhereInput) {
    assignments: rDNCases(where: $where) {
      caseId
      lenderClientId
      lenderClientName
    }
  }
`;

export const REPOSSESSIONS_QUERY = gql`
  query RDNCases($where: RDNCaseWhereInput) {
    repossessions: rDNCases(where: $where) {
      caseId
      lenderClientId
    }
  }
`;

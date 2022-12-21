import gql from 'graphql-tag';

export const AGGREGATE_MISSED_REPOSSESSIONS_QUERY = gql`
  query AggregateMissedRepossession($where: MissedRepossessionWhereInput) {
    missedRepossesions: aggregateMissedRepossession(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const MISSED_REPOSSESSIONS_QUERY = gql`
  query MissedRepossessions(
    $where1: MissedRepossessionWhereInput
    $where2: MissedRepossessionWhereInput
    $orderBy: [MissedRepossessionOrderByWithRelationInput!]
  ) {
    current: missedRepossessions(where: $where1, orderBy: $orderBy) {
      createdAt
      case {
        caseId
        vin
        vinLastEight
        status
        orderType
        closeDate
        holdDate
        originalOrderDate
        spottedDate
        spottedAddress
        spottedLat
        spottedLng
        vendorBranchName
        yearMakeModel
        vendor_address
        lenderClientId
        lenderClientName
        spotterId
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

export const AGGREGATE_ASSIGNMENTS_QUERY = gql`
  query AggregateRDNCase($where: RDNCaseWhereInput) {
    assignments: aggregateRDNCase(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const ASSIGNMENTS_QUERY = gql`
  query RDNCases($where: RDNCaseWhereInput) {
    assignments: rDNCases(where: $where) {
      caseId
      lenderClientId
    }
  }
`;

export const AGGREGATE_REPOSSESSIONS_QUERY = gql`
  query AggregateRDNCase($where: RDNCaseWhereInput) {
    repossessions: aggregateRDNCase(where: $where) {
      _count {
        caseId
      }
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

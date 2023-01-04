import gql from 'graphql-tag';

export const ASSIGNMENT_COUNT_QUERY = gql`
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

export const REPOSSESSION_COUNT_QUERY = gql`
  query AggregateRDNCase($where: RDNCaseWhereInput) {
    repossessions: aggregateRDNCase(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const MISSED_REPOSSESSION_COUNT_QUERY = gql`
  query AggregateMissedRepossession($where: MissedRepossessionWhereInput) {
    missedRepossesions: aggregateMissedRepossession(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const MISSED_REPOSSESSION_QUERY = gql`
  query Case($where: MissedRepossessionWhereInput) {
    missedRepossessions: missedRepossessions(where: $where) {
      case {
        caseId
        lenderClientId
      }
    }
  }
`;

import gql from 'graphql-tag';

export const ASSIGNMENT_COUNT = gql`
  query AggregateRDNCase($where: RDNCaseWhereInput) {
    assignments: aggregateRDNCase(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const REPOSSESSION_COUNT = gql`
  query AggregateRDNCase($where: RDNCaseWhereInput) {
    repossessions: aggregateRDNCase(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

export const MISSED_REPOSSESSION_COUNT = gql`
  query AggregateMissedRepossession($where: MissedRepossessionWhereInput) {
    missedRepossesions: aggregateMissedRepossession(where: $where) {
      _count {
        caseId
      }
    }
  }
`;

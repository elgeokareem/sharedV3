import { GraphQLClient, MissedRepossession } from '../../shared/types';

export type MissedRepossessionsResult = {
  current: MissedRepossession[];
  previous: MissedRepossession[];
};

export interface OverviewStatsInput {
  client: GraphQLClient;
  startDate: string;
  endDate: string;
  previousStartDate: string;
  previousEndDate: string;
  rdnStartDate: string;
  rdnEndDate: string;
  rdnPreviousStartDate: string;
  rdnPreviousEndDate: string;
}

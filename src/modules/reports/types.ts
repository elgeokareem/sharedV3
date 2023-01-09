import { GraphQLClient, GraphQLClientMutation } from 'shared/types';

/* eslint-disable no-unused-vars */
export enum TARGET_RECOVERY_RATE_DURATION_TYPE {
  MTD = 'MTD',
  YTD = 'YTD',
}

export interface TargetRecoveryRate {
  branchId: number;
  clientId: string;
  duration: TARGET_RECOVERY_RATE_DURATION_TYPE;
  targetRecoveryRate: number;
  userId: number;
}

export interface UpdateTargetRecoveryRateInput {
  client: GraphQLClientMutation;
  targetRecoveryRate: string;
  updateBranches: number[] | null[];
  clientId: string;
  updateDurations: string[];
  userId: number;
}

export interface ClientListInput {
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

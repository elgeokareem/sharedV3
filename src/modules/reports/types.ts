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

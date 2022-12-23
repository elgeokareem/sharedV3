import { MISSED_REPOSSESSED_STATUSES } from '../constants';
import { Case, CASE_STATUSES } from '../types';

/**
 * Assuming that the status logs are ordered by date, this function will return the most recent Open Date in UTC.
 *
 * @param caseData - The case data.
 * @returns - A UTC Date of the most recent open Status or null if none.
 */
export const getMostRecentOpenDate = (caseData: Case): string | null => {
  const caseLogs = caseData.RDNCaseLog;
  for (let i = 0; i < caseLogs.length; i++) {
    const caseLog = caseLogs[i];
    if (MISSED_REPOSSESSED_STATUSES.includes(caseLog.status)) {
      let mostRecentOpenDate = null;
      for (let j = i + 1; j < caseLogs.length; j++) {
        const nextCaseLog = caseLogs[j];
        if (nextCaseLog.status === CASE_STATUSES.open) {
          mostRecentOpenDate = nextCaseLog.createdAt;
        }
      }
      return mostRecentOpenDate;
    }
  }
  return null;
};

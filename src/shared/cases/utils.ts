import { MISSED_REPOSSESSED_STATUSES } from '../constants';
import { Case, CASE_STATUSES } from '../types';

/**
 * Assuming that the status logs are ordered by date, this function will return if there was a OPEN status after a Missed Repossession.
 *
 * @param caseData - The case data.
 * @returns - True if the case was reopened.
 * @example
 */
export const wasCaseReopen = (caseData: Case): boolean => {
  const caseLogs = caseData.RDNCaseLog;
  for (let i = 0; i < caseLogs.length; i++) {
    const caseLog = caseLogs[i];
    if (MISSED_REPOSSESSED_STATUSES.includes(caseLog.status)) {
      for (let j = i + 1; j < caseLogs.length; j++) {
        const nextCaseLog = caseLogs[j];
        if (nextCaseLog.status === CASE_STATUSES.open) {
          return true;
        }
      }
      return false;
    }
  }
  return false;
};

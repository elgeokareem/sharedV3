import { Case } from '../../shared/types';

export type MissedRepossessionsResult = {
  current: Case[],
  previous: Case[]
}

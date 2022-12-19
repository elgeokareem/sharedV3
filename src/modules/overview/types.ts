import { MissedRepossession } from '../../shared/types';

export type MissedRepossessionsResult = {
  current: MissedRepossession[],
  previous: MissedRepossession[]
}

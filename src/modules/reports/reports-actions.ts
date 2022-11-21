import { createAction } from '@cobuildlab/react-simple-state';

import { fetchSecuredCaseBySpotters } from './reports-services';
import {
  OnSecuredCasesBySpotterEvent,
  OnSecuredCasesBySpotterEventError,
} from './reports-events';

export const fetchSecuredCaseBySpottersAction = createAction(
  OnSecuredCasesBySpotterEvent,
  OnSecuredCasesBySpotterEventError,
  fetchSecuredCaseBySpotters,
);

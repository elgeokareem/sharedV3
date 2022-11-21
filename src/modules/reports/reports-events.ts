import { createEvent } from '@cobuildlab/react-simple-state';

export const OnSecuredCasesBySpotterEvent = createEvent<{
  camerasByBranch: any;
  camerasByUser: any;
  cameraHitsAndUsers: any;
}>();
export const OnSecuredCasesBySpotterEventError = createEvent();

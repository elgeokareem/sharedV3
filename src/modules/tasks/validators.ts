import moment = require('moment');
import { TaskType } from './types';

export const IS_VALID_COMPLETION_DATE_ERROR =
  'Please select more than 10 minutes for a task.';

export const validateCompletionDate = (
  completionDate: string,
  currentDate: string,
) => {
  const allowedTimeMilliseconds = moment(currentDate)
    .add(10, 'minutes')
    .valueOf();
  const completionDateMilliSeconds = moment(completionDate).valueOf();

  if (completionDateMilliSeconds < allowedTimeMilliseconds) {
    return [false, IS_VALID_COMPLETION_DATE_ERROR];
  }

  return [true, ''];
};

export const isTaskOnTime = (task: TaskType) => {
  if (!task?.completionDate) return false;
  return moment(task.completionDate).isAfter(moment());
};

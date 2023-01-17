/* eslint-disable jsdoc/no-types */
import moment, { Moment } from 'moment';

import packageJson from '../../package.json';
import { DriverType, ShiftType, UserType } from './types';

/**
 * Replace multi spaces with single spaces.
 *
 * @example const newString = trimMultiSpaces(text);
 * @param {string} text - The text to replace.
 * @returns The new string.
 */
export const trimMultiSpaces = (text: string) => {
  if (!text) return '';
  return text.replace(/  +/g, ' ');
};

/**
 * Sort Drivers.
 *
 * This function sort the drivers using the count number and the first name
 * to order the drivers alphabetically when count have the same value.
 *
 * @example topRecoveryAgnes.sort(sortDrivers)
 * @param {object} x - Driver x.
 * @param {object} y - Driver y.
 * @returns Number.
 */
export const sortDrivers = (x: DriverType, y: DriverType) => {
  const countY = y.count;
  const countX = x.count;

  if (
    countY === countX &&
    x.firstName &&
    y.firstName &&
    x.firstName !== '' &&
    y.firstName !== ''
  ) {
    return x.firstName.charCodeAt(0) - y.firstName.charCodeAt(0);
  }

  return countY - countX;
};

/**
 * To filter user by fullName for dropdown/select.
 *
 * @example users.filter((user) => filterUser(`${user.firstName} ${user.lastName}`, search));
 * @param {string} fullName - The user to filter.
 * @param {string} search - To filter the users.
 * @returns If the user is valid on filter.
 */
export const filterUserByFullName = (fullName: string, search: string) => {
  if (!search) return true;

  const searchLowercase = trimMultiSpaces(search).toLowerCase();
  const fullNameLowercase = trimMultiSpaces(fullName).toLowerCase();

  if (fullNameLowercase.includes(searchLowercase)) return true;

  return false;
};

/**
 * To filter user by firstName/lastName/fullName for dropdown/select.
 *
 * @example users.filter((user) => filterUser(user, search));
 * @param {object} user - The user to filter.
 * @param {string} search - To filter the users.
 * @returns If the user is valid on filter.
 */
export const filterUser = (user: UserType, search: string) => {
  if (!search) return true;

  const { firstName, lastName } = user;
  const fullName = `${firstName} ${lastName}`;

  return filterUserByFullName(fullName, search);
};

/**
 * Check if a shift is active.
 * 
 * @param {ShiftType} shift - The shift.
 * @param {Moment} startTime - Start time of shift 
 * @param {Moment} endTime - End time of shift.
 * @param {Moment} momentNow - Current Time.
 * @returns {boolean} If the shift is active or not.
 */
export const isShiftActive = (shift: ShiftType, startTime: Moment, endTime: Moment, momentNow = moment()) => {
  if (!shift) {
    throw new Error("Shift can't be null");
  }
  
  const { days } = shift;

  if (!days) {
    throw new Error('Shift needs days');
  }

  let isActive = false;
  if (momentNow.isBetween(startTime, endTime, undefined, '[]') === true) {
    // Check if the day (Mon, Tue, etc.) is one of the days of activity of the shift.
    isActive = days.includes(momentNow.format('ddd'));
  }

  return isActive
}

/**
 * To get time ranges (yesterday's and today's) of shift.
 * 
 * @param {ShiftType} shift - The shift.
 * @param {Moment} momentNow - Current Time.
 * @returns Time ranges (today and yesterday).
 */
export const getTimeRangeShift = (shift: ShiftType, momentNow = moment()) => {
  if (!shift) {
    throw new Error("Shift can't be null");
  }

  const { startTimeV2, endTimeV2, days } = shift;

  if (!startTimeV2 || !endTimeV2 || !days) {
    throw new Error('Shift needs days, startTime and endTime');
  }

  const [startHour, startMinute] = startTimeV2.split(':');
  const [endHour, endMinute] = endTimeV2.split(':');
  const momentStartTime = momentNow
    .clone()
    .hour(parseInt(startHour))
    .minute(parseInt(startMinute));
  const momentEndTime = momentNow
    .clone()
    .hour(parseInt(endHour))
    .minute(parseInt(endMinute));

  // Next Day adjustment
  if (momentEndTime.isBefore(momentStartTime)) {
    momentEndTime.add(1, 'days');
  }

  const momentYesterdayStartTime = momentStartTime.clone().subtract(1, 'days');
  const momentYesterdayEndTime = momentEndTime.clone().subtract(1, 'days');

  return {
    startTime: momentStartTime,
    endTime: momentEndTime,
    yesterdayStartTime: momentYesterdayStartTime,
    yesterdayEndTime: momentYesterdayEndTime,
  };
}

export const version = (): string => packageJson.version;

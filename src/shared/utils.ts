/* eslint-disable jsdoc/no-types */
import { DriverType } from './types';

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

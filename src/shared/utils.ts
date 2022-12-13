/* eslint-disable jsdoc/no-types */
import { DriverType, UserType } from './types';

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
 * To filter users by firstname/lastname on dropdown/select.
 *
 * @example users.filter(filterUsers);
 * @param {object} users - The users to filter.
 * @param {string} search - To filter the users.
 * @returns The filteredUsers list.
 */
export const filterUsers = (users: UserType[], search: string) => {
  const filteredUsers = users.filter((user) => {
    if (!search) return true;

    const searchLowercase = search.toLowerCase();
    const firstName = `${user.firstName}`.toLowerCase();
    const lastName = `${user.lastName}`.toLowerCase();
    // replace multiple spaces with a single space
    const fullName = `${firstName} ${lastName}`
      .replace(/  +/g, ' ')
      .toLowerCase();

    if (firstName.includes(searchLowercase)) return true;
    if (lastName.includes(searchLowercase)) return true;
    if (fullName.includes(searchLowercase)) return true;

    return false;
  });

  return filteredUsers;
};

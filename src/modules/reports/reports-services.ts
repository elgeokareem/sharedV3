import moment = require('moment-timezone');

import {
  formatVinsByUser,
  mapVinsToUserAndAllVins,
  formatSecuredByUser,
  formatSecuredByUserList,
  sumAndGroupScanByUser,
  sumCameraHitsByUserAndClientLenderCount,
  statusCalc,
  statusCalcCameraScans,
  statusCalcAllHits,
  groupCamerasByBranch,
  groupCamerasByUser,
  getAllVins,
  groupCameraHitsByUser,
  groupByDrnId,
  compareScans,
  compareLiveHitsByUser,
  compareLiveHitsByClientLender,
  groupSecuredRDNCasesWithCameraHits,
  compareSecuredRDNCasesByUser,
  compareSecuredRDNCasesByClientLender,
  addUsersToData,
  groupByBranch,
  removeDuplicatedVins,
  groupByUser,
} from './reports-helpers';
import {
  FETCH_ALL_MISSED_REPOSSESSIONS,
  FETCH_CAMERA_HITS,
  FETCH_SECURED_CASES,
} from './reports-queries';
import {
  Branches,
  BranchTable,
  CASE_STATUSES,
  GraphQLClient,
  RdnCurrent,
  RdnPrevious,
  UserType,
} from '../../shared/types';
import { DATE_FORMAT, ERROR_MESSAGES } from '../../shared/constants';

export const fetchSecuredCaseBySpotters = (client: GraphQLClient) => {
  return async (
    startDate: string,
    endDate: string,
  ): Promise<{
    camerasByBranch: any;
    camerasByUser: any;
    cameraHitsAndUsers: any;
  }> => {
    if (!moment(startDate, DATE_FORMAT, true).isValid()) {
      throw new Error(ERROR_MESSAGES.startDateInvalid);
    }

    if (!moment(endDate, DATE_FORMAT, true).isValid()) {
      throw new Error(ERROR_MESSAGES.endDateInvalid);
    }

    const cameraHitsVariables = {
      where: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format(DATE_FORMAT),
            },
          },
        ],
      },
      where1: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
        ],
      },
      where2: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format(DATE_FORMAT),
            },
          },
        ],
      },
      where3: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
        ],
      },
    };
    const {
      data: {
        cameraHits,
        previousCameraHits,
        users,
        branches,
        cameraScans,
        previousCameraScans,
      },
    } = await client.query({
      query: FETCH_CAMERA_HITS,
      variables: cameraHitsVariables,
    });

    const usersFiltered = users.filter(
      (user: UserType) => user.drnId !== undefined || user.drnId !== null,
    );

    const idToBranch = {};

    branches.forEach((branch: any) => {
      // @ts-ignore
      idToBranch[branch.id] = branch.name;
    });

    const vinsByUser = formatVinsByUser(cameraHits);
    const previousVinsByUser = formatVinsByUser(previousCameraHits);

    const { mapVinsToUser, allVins } = mapVinsToUserAndAllVins(vinsByUser);
    const { mapVinsToUser: previousMapVinsToUser, allVins: previousAllVins } =
      mapVinsToUserAndAllVins(previousVinsByUser);

    const securedCasesVariables = {
      where: {
        AND: [
          {
            vinLastEight: {
              in: allVins,
            },
          },
        ],
      },
      where1: {
        AND: [
          {
            vinLastEight: {
              in: previousAllVins,
            },
          },
        ],
      },
    };
    const {
      data: { rDNCases, previousRDNCases },
    } = await client.query({
      query: FETCH_SECURED_CASES,
      variables: securedCasesVariables,
    });

    const securedRDNCases = rDNCases.filter(
      (rDNcase: any) => rDNcase.status === CASE_STATUSES.repossessed,
    );

    const previousSecuredRDNCases = previousRDNCases.filter(
      (rDNcase: any) => rDNcase.status === CASE_STATUSES.repossessed,
    );

    const securedByUser = formatSecuredByUser(securedRDNCases, mapVinsToUser);

    const previousSecuredByUser = formatSecuredByUser(
      previousSecuredRDNCases,
      previousMapVinsToUser,
    );

    let securedByUserList = formatSecuredByUserList(
      securedByUser,
      usersFiltered,
      idToBranch,
    );

    const previousSecuredByUserList = formatSecuredByUserList(
      previousSecuredByUser,
      usersFiltered,
      idToBranch,
    );

    let cameraScansList = sumAndGroupScanByUser(
      cameraScans,
      usersFiltered,
      idToBranch,
    );

    const previousCameraScansList = sumAndGroupScanByUser(
      previousCameraScans,
      usersFiltered,
      idToBranch,
    );

    let allHits = sumCameraHitsByUserAndClientLenderCount(
      rDNCases,
      vinsByUser,
      usersFiltered,
      idToBranch,
    );

    const previousAllHits = sumCameraHitsByUserAndClientLenderCount(
      previousRDNCases,
      previousVinsByUser,
      usersFiltered,
      idToBranch,
    );

    securedByUserList = statusCalc(
      securedByUserList,
      previousSecuredByUserList,
    );

    cameraScansList = statusCalcCameraScans(
      cameraScansList,
      previousCameraScansList,
    );

    allHits = statusCalcAllHits(allHits, previousAllHits);
    securedByUserList = securedByUserList.sort((a, b) => b.count - a.count);

    const camerasByBranch = groupCamerasByBranch(
      {
        all_hits: allHits,
        secured: securedByUserList,
        scanned: cameraScansList,
      },
      idToBranch,
    );

    const camerasByUser = groupCamerasByUser({
      all_hits: allHits,
      secured: securedByUserList,
      scanned: cameraScansList,
    });

    const cameraHitsAndUsers = cameraHits.map((cameraHit: any) => {
      const user = users.find(
        (userObject: any) =>
          userObject?.drnId?.toLowerCase() === cameraHit?.drnId?.toLowerCase(),
      );
      if (user) {
        return { ...cameraHit, ...user };
      }
      return cameraHit;
    });

    return { camerasByBranch, camerasByUser, cameraHitsAndUsers };
  };
};

export const fetchTest = (client: GraphQLClient) => {
  return async (startDate: string, endDate: string): Promise<any> => {
    if (!moment(startDate, DATE_FORMAT, true).isValid()) {
      throw new Error(ERROR_MESSAGES.startDateInvalid);
    }

    if (!moment(endDate, DATE_FORMAT, true).isValid()) {
      throw new Error(ERROR_MESSAGES.endDateInvalid);
    }

    const cameraHitsVariables = {
      where: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format(DATE_FORMAT),
            },
          },
        ],
      },
      where1: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
        ],
      },
      where2: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format(DATE_FORMAT),
            },
          },
        ],
      },
      where3: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).subtract(1, 'years').format(DATE_FORMAT),
            },
          },
        ],
      },
    };
    const {
      data: {
        cameraHits,
        previousCameraHits,
        users,
        branches,
        cameraScans,
        previousCameraScans,
      },
    } = await client.query({
      query: FETCH_CAMERA_HITS,
      variables: cameraHitsVariables,
    });

    const idToBranch: Branches = {};
    branches.forEach((branch: BranchTable) => {
      // @ts-ignore
      idToBranch[branch.id] = branch.name;
    });

    const { allVins, recordsParsed: currentCameraHitsParsed } =
      getAllVins(cameraHits);
    const {
      allVins: previousAllVins,
      recordsParsed: previousCameraHitsParsed,
    } = getAllVins(previousCameraHits);

    const securedCasesVariables = {
      where: {
        AND: [
          {
            vinLastEight: {
              in: allVins,
            },
          },
        ],
      },
      where1: {
        AND: [
          {
            vinLastEight: {
              in: previousAllVins,
            },
          },
        ],
      },
    };
    const {
      data: {
        rDNCases: rDNCasesNoFilter,
        previousRDNCases: previousRDNCasesNoFilter,
      },
    } = await client.query({
      query: FETCH_SECURED_CASES,
      variables: securedCasesVariables,
    });

    const rDNCases = removeDuplicatedVins(rDNCasesNoFilter);
    const previousRDNCases = removeDuplicatedVins(previousRDNCasesNoFilter);

    const securedRDNCases = rDNCases.filter(
      (rDNcase: RdnCurrent) => rDNcase.status === CASE_STATUSES.repossessed,
    );
    const previousSecuredRDNCases = previousRDNCases.filter(
      (rDNcase: RdnPrevious) => rDNcase.status === CASE_STATUSES.repossessed,
    );

    // group all lpr and direct vins into their own user.
    const currentCameraHitsByUser = groupCameraHitsByUser(
      currentCameraHitsParsed,
    );
    const previousCameraHitsByUser = groupCameraHitsByUser(
      previousCameraHitsParsed,
    );

    /**
     * Scanned -----------------------------.
     */
    const currentScansGrouped = groupByDrnId(cameraScans);
    const previousScansGrouped = groupByDrnId(previousCameraScans);

    const currentScansWithStatus = compareScans(
      currentScansGrouped,
      previousScansGrouped,
    );

    /**
     * Live Hits -----------------------------.
     */
    // For card data.
    const currentLiveHitsWithStatus = compareLiveHitsByUser(
      currentCameraHitsByUser,
      previousCameraHitsByUser,
    );

    // For modal data.
    const currentLiveHitsLenderInfo = compareLiveHitsByClientLender(
      currentCameraHitsByUser,
      previousCameraHitsByUser,
      rDNCases,
      previousRDNCases,
    );

    /**
     * Secured -----------------------------.
     */
    // group cases by user.
    const currentGroupSecuredRDNCases = groupSecuredRDNCasesWithCameraHits(
      securedRDNCases,
      currentCameraHitsByUser,
    );
    const previousGroupSecuredRDNCases = groupSecuredRDNCasesWithCameraHits(
      previousSecuredRDNCases,
      previousCameraHitsByUser,
    );

    // For card data.
    const currentSecuredRDNCasesWithStatus = compareSecuredRDNCasesByUser(
      currentGroupSecuredRDNCases,
      previousGroupSecuredRDNCases,
    );

    // For modal data.
    const currentSecuredRDNCasesWithStatusByClientLender =
      compareSecuredRDNCasesByClientLender(
        currentGroupSecuredRDNCases,
        previousGroupSecuredRDNCases,
      );

    /**
     * Add users to data -----------------------------.
     */
    const scansWithUsers = addUsersToData(
      currentScansWithStatus,
      users,
      idToBranch,
    );

    const liveHitsWithUsers = addUsersToData(
      currentLiveHitsWithStatus,
      users,
      idToBranch,
    );

    const securedRDNCasesWithUsers = addUsersToData(
      currentSecuredRDNCasesWithStatus,
      users,
      idToBranch,
    );

    /**
     * Grouping of the data -----------------------------.
     */
    const camerasByBranch = groupByBranch(
      scansWithUsers,
      liveHitsWithUsers,
      securedRDNCasesWithUsers,
      branches,
    );

    const camerasByUser = groupByUser(camerasByBranch);

    const modalsData = {
      liveHits: currentLiveHitsLenderInfo,
      secured: currentSecuredRDNCasesWithStatusByClientLender,
    };

    return { camerasByBranch, modalsData, camerasByUser };
  };
};

// By default, year is 0 to retrieve the current year's missed repossessions.
// We can pass in 1 for the year to retrieve the previous year's missed repossessions.
export const fetchMissedRepossessions = async (
  client: GraphQLClient,
  startDate: string,
  endDate: string,
  branchId: number,
) => {
  let missedRepossessionsVariables;

  if (branchId === 0) {
    missedRepossessionsVariables = {
      where: {
        missedDate: {
          lte: endDate,
          gte: startDate,
        },
      },
    };
  } else {
    missedRepossessionsVariables = {
      where: {
        AND: [
          {
            missedDate: {
              lte: endDate,
              gte: startDate,
            },
            case: {
              is: {
                users: {
                  is: {
                    branchId: {
                      equals: branchId,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };
  }

  const { data } = await client.query({
    query: FETCH_ALL_MISSED_REPOSSESSIONS,
    variables: missedRepossessionsVariables,
  });

  return data?.aggregateMissedRepossession?._count?.id;
};

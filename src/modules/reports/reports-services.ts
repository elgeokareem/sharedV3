import moment = require('moment');
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

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
} from './reports-helpers';
import { FETCH_CAMERA_HITS, FETCH_SECURED_CASES } from './reports-queries';
import { CASE_STATUSES } from 'shared/types';
import { DATE_FORMAT } from 'shared/constants';

export const fetchSecuredCaseBySpotters = (
  client: ApolloClient<NormalizedCacheObject>,
) => {
  return async (
    startDate: string,
    endDate: string,
  ): Promise<{
    camerasByBranch: any;
    camerasByUser: any;
    cameraHitsAndUsers: any;
  }> => {
    if (!moment(startDate, DATE_FORMAT, true).isValid()) {
      throw new Error('startDate format invalid!');
    }

    if (!moment(endDate, DATE_FORMAT, true).isValid()) {
      throw new Error('endDate format invalid!');
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

    const usersFiltered = users.filter((user: any) => user.drnId);

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

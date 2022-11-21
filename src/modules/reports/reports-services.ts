import moment = require('moment');
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

export const fetchSecuredCaseBySpotters = (client: any) => {
  return async (
    startDate: string,
    endDate: string,
  ): Promise<{
    camerasByBranch: any;
    camerasByUser: any;
    cameraHitsAndUsers: any;
  }> => {
    const cameraHitsVariables = {
      where: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format('YYYY-MM-DD 00:00:00'),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format('YYYY-MM-DD 23:59:59'),
            },
          },
        ],
      },
      where1: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate)
                .subtract(1, 'years')
                .format('YYYY-MM-DD 00:00:00'),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate)
                .subtract(1, 'years')
                .format('YYYY-MM-DD 23:59:59'),
            },
          },
        ],
      },
      where2: {
        AND: [],
      },
      where3: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate).format('YYYY-MM-DD 00:00:00'),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate).format('YYYY-MM-DD 23:59:59'),
            },
          },
        ],
      },
      where4: {
        AND: [
          {
            scanned_at: {
              gte: moment(startDate)
                .subtract(1, 'years')
                .format('YYYY-MM-DD 00:00:00'),
            },
          },
          {
            scanned_at: {
              lte: moment(endDate)
                .subtract(1, 'years')
                .format('YYYY-MM-DD 23:59:59'),
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
      (rDNcase: any) => rDNcase.status === 'Repossessed',
    );

    const previousSecuredRDNCases = previousRDNCases.filter(
      (rDNcase: any) => rDNcase.status === 'Repossessed',
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

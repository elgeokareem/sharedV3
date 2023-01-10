import moment = require('moment-timezone');

import {
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
  addScannedDateToLiveHits,
} from './helpers';

import {
  CREATE_TARGET_RECOVERY_RATES,
  FETCH_CAMERA_HITS,
  FETCH_SECURED_CASES,
  FETCH_TARGET_RECOVERY_RATES_BY_USER,
  UPDATE_TARGET_RECOVERY_RATES,
} from './queries';

import {
  ClientListInput,
  TargetRecoveryRate,
  TargetRecoveryRateCreateManyInput,
  UpdateTargetRecoveryRateInput,
} from './types';

import {
  Branches,
  BranchTable,
  CASE_STATUSES,
  GraphQLClient,
  GraphQLClientMutation,
  RdnCurrent,
  RdnPrevious,
} from '../../shared/types';

import {
  DATETIME_FORMAT,
  DATE_FORMAT,
  ERROR_MESSAGES,
} from '../../shared/constants';

import {
  getAssignments,
  getMissedRepossessions,
  getRepossessions,
} from '../../shared/services';

export const fetchSecuredCaseBySpotters = (client: GraphQLClient) => {
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

    // Grouping for the modal data.
    const currentLiveHitsLenderInfo = compareLiveHitsByClientLender(
      currentCameraHitsByUser,
      previousCameraHitsByUser,
      rDNCases,
      previousRDNCases,
    );

    // Add the scanned date to the live hits.
    const liveHitsModalInfo = addScannedDateToLiveHits(
      currentCameraHitsParsed,
      currentLiveHitsLenderInfo,
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
      liveHits: liveHitsModalInfo,
      secured: currentSecuredRDNCasesWithStatusByClientLender,
    };

    return { camerasByBranch, modalsData, camerasByUser };
  };
};

export const fetchTargetRecoveryRatesByUser = async (
  client: GraphQLClient,
  userId: number,
  fetchPolicy: string = 'network-only',
): Promise<TargetRecoveryRate[]> => {
  const variables: Record<string, any> = {
    where: { userId: { equals: userId } },
  };

  const res = await client.query({
    query: FETCH_TARGET_RECOVERY_RATES_BY_USER,
    variables,
    fetchPolicy,
  });

  return res?.data?.targetRecoveryRates;
};

export const updateManyTargetRecoveryRates = async (
  client: GraphQLClientMutation,
  input: UpdateTargetRecoveryRateInput,
) => {
  const updateVariables: Record<string, any> = {
    data: {
      targetRecoveryRate: { set: Number(input.targetRecoveryRate) },
      updatedAt: { set: moment() },
    },
    where: {
      branchId:
        input.updateBranches[0] === null
          ? { equals: null }
          : { in: input.updateBranches },
      clientId: { equals: input.clientId },
      duration: { in: input.updateDurations },
      userId: { equals: input.userId },
    },
  };

  const response = await client.mutate({
    mutation: UPDATE_TARGET_RECOVERY_RATES,
    variables: updateVariables,
  });

  return response;
};

export const createManyTargetRecoveryRates = async (
  client: GraphQLClientMutation,
  data: TargetRecoveryRateCreateManyInput[],
) => {
  const createVariables: Record<string, any> = {
    data,
    skipDuplicates: true,
  };

  const response = await client.mutate({
    mutation: CREATE_TARGET_RECOVERY_RATES,
    variables: createVariables,
  });

  return response;
};

export const fetchClientList = async (input: ClientListInput) => {
  // Validate all inputted start dates.
  if (!moment(input.startDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.previousStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.rdnStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  if (!moment(input.rdnPreviousStartDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.startDateInvalid);

  // Validate all inputted end dates.
  if (!moment(input.endDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.previousEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.rdnEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  if (!moment(input.rdnPreviousEndDate, DATETIME_FORMAT, true).isValid())
    throw new Error(ERROR_MESSAGES.endDateInvalid);

  const currentAssignments = await getAssignments(
    input.client,
    input.startDate,
    input.endDate,
  );

  const previousAssignments = await getAssignments(
    input.client,
    input.previousStartDate,
    input.previousEndDate,
  );

  const currentRepossessions = await getRepossessions(
    input.client,
    input.rdnStartDate,
    input.rdnEndDate,
  );

  const previousRepossessions = await getRepossessions(
    input.client,
    input.rdnPreviousStartDate,
    input.rdnPreviousEndDate,
  );

  const currentMissedRepossessions = await getMissedRepossessions(
    input.client,
    input.rdnStartDate,
    input.rdnEndDate,
  );

  const previousMissedRepossessions = await getMissedRepossessions(
    input.client,
    input.rdnPreviousStartDate,
    input.rdnPreviousEndDate,
  );

  return {
    currentAssignments,
    previousAssignments,
    currentRepossessions,
    previousRepossessions,
    currentMissedRepossessions,
    previousMissedRepossessions,
  };
};

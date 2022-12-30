import moment = require('moment');
import {
  Branches,
  BranchTable,
  CameraHitParsed,
  CameraHitType,
  DuplicatedVins,
  GroupedHits,
  GroupedRDNCases,
  LiveHitsDetails,
  RdnCurrent,
  RdnPrevious,
  SecuredUsers,
  TopCameraCardData,
  UsersTable,
} from '../../shared/types';

export const removeDuplicatedVins = (rdnCases: DuplicatedVins[]) => {
  // Group by vinLastEight
  const groupedBy8Vin: { [vin8: string]: any } = {};

  rdnCases.forEach((rdnCase) => {
    if (!groupedBy8Vin[rdnCase.vinLastEight]) {
      groupedBy8Vin[rdnCase.vinLastEight] = [rdnCase];
    }

    groupedBy8Vin[rdnCase.vinLastEight].push(rdnCase);
  });

  // Get the most recent vin
  const mostRecentVins = Object.keys(groupedBy8Vin).map((vin8) => {
    const cases = groupedBy8Vin[vin8];

    const mostRecentCase = cases.reduce(
      (prev: DuplicatedVins, current: DuplicatedVins) => {
        const prevDate = moment(prev.originalOrderDate);
        const currentDate = moment(current.originalOrderDate);

        if (prevDate.isAfter(currentDate)) {
          return prev;
        }

        return current;
      },
    );

    return mostRecentCase;
  });

  return mostRecentVins;
};

export const getAllVins = (scans: CameraHitType[]) => {
  let allVins: string[] = [];

  const recordsParsed = scans.map((scan) => {
    const lprVins: string[] = JSON.parse(scan.lpr_vins) || [];
    const directHitsVins: string[] = JSON.parse(scan.direct_hits_vins) || [];

    allVins = allVins.concat(lprVins, directHitsVins);

    return {
      ...scan,
      lpr_vins: lprVins,
      direct_hits_vins: directHitsVins,
    };
  });

  return { recordsParsed, allVins };
};

/**
 * Scans.
 */

type ScansRaw = { scanned_at: string; drnId: string; count: number }[];
export const groupByDrnId = (scans: ScansRaw) => {
  const groupedScans: { [drnId: string]: number } = {};
  scans.forEach((scan) => {
    const drnId = scan.drnId.toLowerCase();

    if (groupedScans[drnId]) {
      groupedScans[drnId] += scan.count;
    } else {
      groupedScans[drnId] = scan.count;
    }
  });

  // Convert to array with shape { drnId, count }
  return Object.keys(groupedScans).map((drnId) => ({
    drnId,
    count: groupedScans[drnId],
  }));
};

type Scans = { drnId: string; count: number }[];
export const compareScans = (scans: Scans, previousScans: Scans) => {
  return scans.map((scan) => {
    const previousScan = previousScans.find(
      (previousScan) => previousScan.drnId === scan.drnId,
    );

    if (previousScan) {
      if (scan.count >= previousScan.count) {
        return { ...scan, status: 1 };
      }

      return { ...scan, status: -1 };
    }

    return { ...scan, status: 1 };
  });
};

/**
 * Live Hits.
 */

export const compareLiveHitsByUser = (
  currentGroupedHits: GroupedHits,
  previousGroupedHits: GroupedHits,
) => {
  const currentUsers = Object.keys(currentGroupedHits);
  const previousUsers = Object.keys(previousGroupedHits);

  const currentUsersWithStatus = currentUsers.map((user) => {
    const previousUser = previousUsers.find(
      (previousUser) => previousUser === user,
    );

    const currentGroupData = currentGroupedHits[user];

    if (!previousUser) {
      return {
        ...currentGroupData,
        previousValue: 0,
        drnId: user,
        status: 1,
      };
    }

    // If there is a previous user, get the data
    const previousGroupData = previousGroupedHits[previousUser];

    const currentCount = currentGroupData.count;
    const previousCount = previousGroupData.count;

    const status = currentCount >= previousCount ? 1 : -1;

    return {
      ...currentGroupData,
      previousValue: previousCount,
      drnId: user,
      status,
    };
  });

  return currentUsersWithStatus;
};

export const compareLiveHitsByClientLender = (
  currentCameraHitsByUser: GroupedHits,
  previousCameraHitsByUser: GroupedHits,
  rDNCases: RdnCurrent[],
  previousRDNCases: RdnPrevious[],
) => {
  const currentUsers = Object.keys(currentCameraHitsByUser);
  const result: LiveHitsDetails[] = [];

  // Iterate over each user
  for (let index = 0; index < currentUsers.length; index++) {
    const currentUser = currentUsers[index];
    const currentUserData = currentCameraHitsByUser[currentUser];
    const previousUserData = previousCameraHitsByUser[currentUser];

    // unique current vins
    const currentUniqueVins: string[] = [
      ...new Set([
        ...currentUserData.direct_hits_vins,
        ...currentUserData.lpr_vins,
      ]),
    ];
    // unique previous vins for user if it doesnt exist, set to empty array
    const previousUniqueVins: string[] = [];
    if (previousUserData) {
      previousUniqueVins.push(
        ...new Set([
          ...previousUserData.direct_hits_vins,
          ...previousUserData.lpr_vins,
        ]),
      );
    }

    // Get cases data for current and previous vins
    const currentCases = rDNCases.filter((rdnCase) =>
      currentUniqueVins.includes(rdnCase.vinLastEight),
    );
    const previousCases = previousRDNCases.filter((rdnCase) =>
      previousUniqueVins.includes(rdnCase.vinLastEight),
    );

    // Group current cases by lenderClientId
    const groupCurrentByLenderClientId: {
      [lenderID: string]: {
        name: string;
        drnId: string;
        value: number;
        details: RdnCurrent[];
      };
    } = {};
    // const repeatedVins: string[] = [];
    for (let index = 0; index < currentCases.length; index++) {
      const rdnCase = currentCases[index];

      // If lenderClientId doesnt exist, create it
      if (!groupCurrentByLenderClientId[rdnCase.lenderClientId]) {
        groupCurrentByLenderClientId[rdnCase.lenderClientId] = {
          name: rdnCase.lenderClientName,
          drnId: currentUser,
          value: 1,
          details: [rdnCase],
        };

        continue;
      }

      // If lenderClientId exists, add to count and details
      groupCurrentByLenderClientId[rdnCase.lenderClientId] = {
        ...groupCurrentByLenderClientId[rdnCase.lenderClientId],
        value: groupCurrentByLenderClientId[rdnCase.lenderClientId].value + 1,
        details: [
          ...groupCurrentByLenderClientId[rdnCase.lenderClientId].details,
          rdnCase,
        ],
      };
    }

    // Group previous cases by lenderClientId. We don't need aditional info for previos cases
    const groupPreviousByLenderClientId: {
      [lenderID: string]: {
        drnId: string;
        value: number;
      };
    } = {};

    for (let index = 0; index < previousCases.length; index++) {
      const rdnCase = previousCases[index];

      // If lenderClientId doesnt exist, create it
      if (!groupPreviousByLenderClientId[rdnCase.lenderClientId]) {
        groupPreviousByLenderClientId[rdnCase.lenderClientId] = {
          drnId: currentUser,
          value: 1,
        };

        continue;
      }

      // If lenderClientId exists, add to count and details
      groupPreviousByLenderClientId[rdnCase.lenderClientId] = {
        drnId: currentUser,
        value: groupPreviousByLenderClientId[rdnCase.lenderClientId].value + 1,
      };
    }

    // Compare current and previous cases by lenderClientId
    const currentLenderClientIds = Object.keys(groupCurrentByLenderClientId);

    for (let index = 0; index < currentLenderClientIds.length; index++) {
      const currentLenderClientId = currentLenderClientIds[index];
      const currentLenderClientData =
        groupCurrentByLenderClientId[currentLenderClientId];

      const previousLenderClientData =
        groupPreviousByLenderClientId[currentLenderClientId];

      if (!previousLenderClientData) {
        result.push({
          ...currentLenderClientData,
          id: currentLenderClientId,
          previousValue: 0,
          status: 1,
        });

        continue;
      }

      const currentCount = currentLenderClientData.value;
      const previousCount = previousLenderClientData.value;

      const status = currentCount >= previousCount ? 1 : -1;

      result.push({
        ...currentLenderClientData,
        id: currentLenderClientId,
        previousValue: previousCount,
        status,
      });
    }
  }

  // Format result
  const finalObject: Record<string, any> = {};
  for (let index = 0; index < result.length; index++) {
    const data = result[index];
    const originalVinsUser = currentCameraHitsByUser[data.drnId];

    if (!finalObject[data.drnId]) {
      finalObject[data.drnId] = {
        directVins: originalVinsUser.direct_hits_vins,
        lprVins: originalVinsUser.lpr_vins,
        data: [{ ...data }],
      };

      continue;
    }

    finalObject[data.drnId].data.push({ ...data });
  }

  return finalObject;
};

export const addScannedDateToLiveHits = (
  cameraHitsTable: any[],
  liveHitsLenderInfo: Record<string, any>,
) => {
  const formattedHits: any = {};

  for (let index = 0; index < cameraHitsTable.length; index++) {
    const hit = cameraHitsTable[index];

    const lprVins = hit.lpr_vins;
    const directVins = hit.direct_hits_vins;
    const allVins = [...lprVins, ...directVins];

    const hitData = allVins.reduce((acc, vin) => {
      if (!acc[vin]) {
        acc[vin] = {
          scannedDate: [],
        };
      }

      acc[vin].scannedDate.push(hit.scanned_at);
      return acc;
    }, {});

    if (!formattedHits[hit.drnId]) {
      formattedHits[hit.drnId] = hitData;
      continue;
    }

    formattedHits[hit.drnId] = {
      // check if vins of hitData exists
      ...formattedHits[hit.drnId],
      ...hitData,
    };
  }

  // Now add the data to the live hits cases
  const drnIds = Object.keys(liveHitsLenderInfo);

  for (let index = 0; index < drnIds.length; index++) {
    const drnId = drnIds[index];
    const liveHitsCases: any[] = liveHitsLenderInfo[drnId].data;

    const newLiveHitsCases = liveHitsCases.map((liveHitCase) => {
      const detailsCase: any[] = liveHitCase.details;

      const newDetailsCase = detailsCase.map((detailCase) => {
        const vinLastEight = detailCase.vinLastEight;
        const scannedDate = formattedHits[drnId][vinLastEight].scannedDate;

        return {
          ...detailCase,
          scannedDate: scannedDate[0],
        };
      });

      return {
        ...liveHitCase,
        details: newDetailsCase,
      };
    });

    liveHitsLenderInfo[drnId].data = newLiveHitsCases;
  }

  return liveHitsLenderInfo;
};

/**
 * Secured.
 */

export const groupCameraHitsByUser = (hits: CameraHitParsed[]) => {
  const groupedHits: GroupedHits = {};

  hits.forEach((hit) => {
    if (!groupedHits[hit.drnId.toLowerCase()]) {
      groupedHits[hit.drnId.toLowerCase()] = { ...hit };
    } else {
      const currentUser = groupedHits[hit.drnId.toLowerCase()];

      groupedHits[hit.drnId.toLowerCase()] = {
        count: currentUser.count + hit.count,
        direct_hits_vins: currentUser.direct_hits_vins.concat(
          hit.direct_hits_vins,
        ),
        lpr_vins: currentUser.lpr_vins.concat(hit.lpr_vins),
      };
    }
  });

  return groupedHits;
};

export const groupSecuredRDNCasesWithCameraHits = (
  securedRDNCases: RdnCurrent[], // it can be RdnPrevious[] but it is irrelevant here
  cameraHitsByUser: GroupedHits,
) => {
  const groupedRDNCases: Record<string, GroupedRDNCases> = {};

  const allDrnIds = Object.keys(cameraHitsByUser);
  for (let index = 0; index < allDrnIds.length; index++) {
    const drnId = allDrnIds[index];

    groupedRDNCases[drnId] = {
      direct: [],
      lpr: [],
    };

    // Loop for direct vins
    const directHitsVins = cameraHitsByUser[drnId].direct_hits_vins;
    for (let index = 0; index < directHitsVins.length; index++) {
      const vin = directHitsVins[index];

      const rdnCase = securedRDNCases.find(
        (rdnCase: any) => rdnCase.vinLastEight === vin,
      );

      if (rdnCase) {
        groupedRDNCases[drnId] = {
          direct: groupedRDNCases[drnId]?.direct.concat([rdnCase]),
          lpr: groupedRDNCases[drnId]?.lpr,
        };
      }
    }

    // Loop for lpr vins
    const lprVins = cameraHitsByUser[drnId].lpr_vins;
    for (let index = 0; index < lprVins.length; index++) {
      const vin = lprVins[index];

      const rdnCase = securedRDNCases.find(
        (rdnCase: any) => rdnCase.vinLastEight === vin,
      );

      if (rdnCase) {
        groupedRDNCases[drnId] = {
          lpr: groupedRDNCases[drnId].lpr.concat([rdnCase]),
          direct: groupedRDNCases[drnId].direct,
        };
      }
    }

    // Don't count the user if it doesn't have any cases
    if (
      groupedRDNCases[drnId].direct.length === 0 &&
      groupedRDNCases[drnId].lpr.length === 0
    ) {
      delete groupedRDNCases[drnId];
    }
  }

  return groupedRDNCases;
};

export const compareSecuredRDNCasesByUser = (
  currentGroupedRDNCases: Record<string, GroupedRDNCases>,
  previousGroupedRDNCases: Record<string, GroupedRDNCases>,
) => {
  const allCurrentDrnIds = Object.keys(currentGroupedRDNCases);
  const allPreviousDrnIds = Object.keys(previousGroupedRDNCases);
  const finalData: SecuredUsers[] = [];

  for (let index = 0; index < allCurrentDrnIds.length; index++) {
    const currentUser = allCurrentDrnIds[index];
    const resultObj: { [key: string]: any } = {
      drnId: currentUser,
    };

    // Get current count
    const { direct, lpr } = currentGroupedRDNCases[currentUser];
    const count = direct.length + lpr.length;

    resultObj.count = count;

    // Get previous count
    const previousUser = allPreviousDrnIds.find(
      (previousUser) => previousUser === currentUser,
    );

    if (!previousUser) {
      resultObj.status = 1;
    } else {
      const { direct: previousDirectCases, lpr: previousLprCases } =
        previousGroupedRDNCases[currentUser];

      const previousCount =
        previousDirectCases.length + previousLprCases.length;

      // Get final status
      const status = count - previousCount >= 0 ? 1 : -1;
      resultObj.status = status;
    }

    // loop direct cases
    const lenderClientObject: { [key: string]: any } = {};
    for (let index = 0; index < direct.length; index++) {
      const directCase = direct[index];

      const lenderClient: string = directCase.lenderClientName;

      if (!lenderClientObject[lenderClient]) {
        lenderClientObject[lenderClient] = {
          value: 1,
          id: directCase.lenderClientId,
        };

        continue;
      }

      lenderClientObject[lenderClient] = {
        ...lenderClientObject[lenderClient],
        value: lenderClientObject[lenderClient].value + 1,
      };
    }

    // loop lpr cases
    for (let index = 0; index < lpr.length; index++) {
      const lprCase = lpr[index];

      const lenderClient: string = lprCase.lenderClientName;

      if (!lenderClientObject[lenderClient]) {
        lenderClientObject[lenderClient] = {
          value: 1,
          id: lprCase.lenderClientId,
        };

        continue;
      }

      lenderClientObject[lenderClient] = {
        ...lenderClientObject[lenderClient],
        value: lenderClientObject[lenderClient].value + 1,
      };
    }

    resultObj.lenderClientCount = lenderClientObject;

    finalData.push(resultObj as SecuredUsers);
  }

  return finalData;
};

export const compareSecuredRDNCasesByClientLender = (
  currentGroupedRDNCases: Record<string, GroupedRDNCases>,
  previousGroupedRDNCases: Record<string, GroupedRDNCases>,
) => {
  const allCurrentDrnIds = Object.keys(currentGroupedRDNCases);
  const allPreviousDrnIds = Object.keys(previousGroupedRDNCases);

  // drnId is the key and the value
  const resultObj: { [key: string]: any } = {};

  // itero sobre todos los current ids
  for (let index = 0; index < allCurrentDrnIds.length; index++) {
    const currentUser = allCurrentDrnIds[index];

    // Get direct and lpr cases
    const { direct: currentDirectCases, lpr: currentLprCases } =
      currentGroupedRDNCases[currentUser];

    // Get unique lender_client_id
    const uniqueLenderClientIds = [
      ...new Set(
        currentDirectCases
          .map((directCase) => directCase.lenderClientId)
          .concat(
            ...new Set(
              currentLprCases.map((lprCase) => lprCase.lenderClientId),
            ),
          ),
      ),
    ] as string[];

    // Get the unique ids of lender clients
    for (let index = 0; index < uniqueLenderClientIds.length; index++) {
      const lenderClientArray = [];
      const lenderClientData: any = {};
      const lenderClientId = uniqueLenderClientIds[index];
      // current count
      const directCases = currentDirectCases.filter(
        (directCase) => directCase.lenderClientId === lenderClientId,
      );
      const lprCases = currentLprCases.filter(
        (lprCase) => lprCase.lenderClientId === lenderClientId,
      );
      const count = directCases.length + lprCases.length;

      // previous count
      const previousUser = allPreviousDrnIds.find(
        (previousUser) => previousUser === currentUser,
      );

      if (!previousUser) {
        lenderClientData['previousValue'] = 0;
        lenderClientData['percentage'] = '100';
      } else {
        const previousDirectCases =
          previousGroupedRDNCases[previousUser].direct;
        const previousLprCases = previousGroupedRDNCases[previousUser].lpr;
        const previousValue =
          previousDirectCases.length + previousLprCases.length;

        lenderClientData['previousValue'] = previousValue;
        lenderClientData['percentage'] = (
          ((count - previousValue) / previousValue) *
          100
        ).toFixed(2);
      }

      // Get the data for this lender_client_id
      let currentLenderIdData = directCases[0];
      // In case there are not direct cases, get the first lpr case
      if (!currentLenderIdData) {
        currentLenderIdData = lprCases[0];
      }
      lenderClientData['id'] = currentLenderIdData.lenderClientId;
      lenderClientData['name'] = currentLenderIdData.lenderClientName;
      lenderClientData['value'] = count;
      lenderClientData['details'] = [...directCases, ...lprCases];
      lenderClientArray.push({ ...lenderClientData });

      if (!resultObj[currentUser]) {
        resultObj[currentUser] = [...lenderClientArray];
      } else {
        resultObj[currentUser] = [
          ...resultObj[currentUser],
          ...lenderClientArray,
        ];
      }
    }
  }

  return resultObj;
};

/**
 * Format functions.
 */

export const addUsersToData = (
  scans: any[],
  users: UsersTable[],
  branches: Branches,
) => {
  const result = scans.map((scan) => {
    const user = users.find(
      (user) => user?.drnId?.toLowerCase() === scan.drnId.toLowerCase(),
    );

    return {
      ...scan,
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatarUrl: user?.avatarUrl,
      userId: user?.id,
      drnId: user?.drnId.toLowerCase() || scan.drnId.toLowerCase(),
      rdnId: user?.drnId?.toLowerCase(),
      branchName: branches[user?.branchId ?? -9999] ?? 'Unknown',
      branchId: user?.branchId ?? -1,
    };
  });

  return result;
};

export const groupByUser = (camerasByBranch: any) => {
  const resultObject: { [key: string]: any } = {};

  for (const branchName in camerasByBranch) {
    const branchObject = camerasByBranch[branchName];
    const result: any[] = [];

    for (const dataName in branchObject) {
      const dataList = branchObject[dataName];

      for (let index = 0; index < dataList.length; index++) {
        const data = dataList[index];

        // Get the agent object
        const agent = result.find((agent) => agent.drnId === data.drnId);

        // If the agent doesn't exist, create it
        if (!agent) {
          result.push({
            ...data,
            [`${dataName}Count`]: data.count,
            [`${dataName}Status`]: data.status,
          });

          continue;
        }

        // If the agent exists, update it
        agent[`${dataName}Count`] = data.count;
        agent[`${dataName}Status`] = data.status;
      }
    }

    resultObject[branchName] = result;
  }

  // Sort the object by scannedCount and add a rank
  for (const branchName in resultObject) {
    const branchObject = resultObject[branchName];

    branchObject.sort((a: any, b: any) => b.scannedCount - a.scannedCount);

    for (let index = 0; index < branchObject.length; index++) {
      const agent = branchObject[index];

      agent.rank = index + 1;
    }
  }

  return resultObject;
};

export const groupByBranch = (
  scans: any[],
  liveHits: any[],
  secured: any[],
  branches: BranchTable[],
) => {
  const result: TopCameraCardData = {};

  result['Company Wide'] = {
    scanned: scans,
    all_hits: liveHits,
    secured: secured,
  };

  result['Unknown'] = {
    scanned: scans.filter((scan) => scan.branchId === -1 || !scan.branchId),
    all_hits: liveHits.filter(
      (liveHit) => liveHit.branchId === -1 || !liveHit.branchId,
    ),
    secured: secured.filter(
      (secure) => secure.branchId === -1 || !secure.branchId,
    ),
  };

  for (let index = 0; index < branches.length; index++) {
    const branch = branches[index];

    result[branch.name] = {
      scanned: scans.filter((scan) => scan.branchId === branch.id),
      all_hits: liveHits.filter((liveHit) => liveHit.branchId === branch.id),
      secured: secured.filter((secure) => secure.branchId === branch.id),
    };
  }

  return result;
};

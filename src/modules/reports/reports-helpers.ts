import {
  Branches,
  BranchTable,
  CameraHitParsed,
  CameraHitType,
  CameraScanType,
  GroupedHits,
  GroupedRDNCases,
  HitType,
  LiveHitsDetails,
  RdnCaseType,
  RdnCurrent,
  RdnPrevious,
  SecuredUsers,
  TopCameraCardData,
  UsersTable,
  UserType,
} from '../../shared/types';

export const formatVinsByUser = (cameraHits: CameraHitType[]) => {
  const vinsByUser: any = {};

  cameraHits.forEach((cameraHit) => {
    let vinsJson = [];
    let vinsLrpJson = [];

    cameraHit.lpr_vins ? (vinsLrpJson = JSON.parse(cameraHit.lpr_vins)) : null;

    if (vinsByUser[cameraHit.drnId] === undefined) {
      vinsByUser[cameraHit.drnId] = { vins: vinsLrpJson, count: 0 };
    } else {
      vinsByUser[cameraHit.drnId].vins =
        vinsByUser[cameraHit.drnId].vins.concat(vinsLrpJson);
    }

    cameraHit.direct_hits_vins
      ? (vinsJson = JSON.parse(cameraHit.direct_hits_vins))
      : null;
    if (vinsByUser[cameraHit.drnId] === undefined) {
      vinsByUser[cameraHit.drnId] = { vins: vinsJson, count: 0 };
    } else {
      vinsByUser[cameraHit.drnId].vins =
        vinsByUser[cameraHit.drnId].vins.concat(vinsJson);
    }

    if (vinsByUser[cameraHit.drnId] === undefined) {
      vinsByUser[cameraHit.drnId] = { count: cameraHit.count };
    } else {
      vinsByUser[cameraHit.drnId].count = vinsByUser[cameraHit.drnId].count +=
        cameraHit.count;
    }
  });

  // remove duplicates string from vins
  Object.keys(vinsByUser).forEach((key) => {
    const filteredVins = vinsByUser[key].vins.filter(
      (item: any, index: any) => vinsByUser[key].vins.indexOf(item) === index,
    );

    vinsByUser[key].vins = filteredVins;
  });

  return vinsByUser;
};

export const mapVinsToUserAndAllVins = (vinsByUser: {
  [key: string]: { vins: string[] };
}) => {
  let allVins: string[] = [];
  // const mapVinsToUser: { [key: string]: string } = {};
  const mapVinsToUser: { [key: string]: string[] } = {};

  Object.keys(vinsByUser).forEach((userId) => {
    const vins = vinsByUser[userId].vins;
    allVins.push(...vins);
    vins.forEach((vin) => {
      // mapVinsToUser[vin] = userId;
      if (mapVinsToUser[vin] === undefined) {
        mapVinsToUser[vin] = [userId];
      } else {
        mapVinsToUser[vin] = [...mapVinsToUser[vin], userId];
      }
    });
  });

  return { allVins, mapVinsToUser };
};

export const formatSecuredByUserList = (
  securedByUser: { [key: string]: UserType },
  users: UserType[],
  idToBranch: { [key: number]: string },
) => {
  // getList of users with their cases
  const securedByUserKeys = Object.keys(securedByUser);
  let securedByUserList: UserType[] = [];

  try {
    securedByUserList = securedByUserKeys.map((userId) => {
      // users = users.filter(userElem => userElem.userId)
      const user = users.find((userElem) => {
        if (userElem.drnId !== null && userElem.drnId !== '')
          return userElem.drnId?.toLowerCase() === userId;
        return undefined;
      });
      if (user === undefined) {
        return { userId, ...securedByUser[userId] };
      }
      return {
        firstName: user?.firstName,
        lastName: user?.lastName,
        userId,
        branchName: idToBranch[user?.branchId],
        avatarUrl: user?.avatarUrl,
        ...securedByUser[userId],
        ...user,
      };
    });
  } catch (err) {
    console.log('SecuredByUserList ', err);
  }

  return securedByUserList;
};

export const sumCameraHitsByUserAndClientLenderCount = (
  rDNCases: RdnCaseType[],
  vinsByUser: {
    [key: string]: { vins: string[]; count: number };
  },
  users: UserType[],
  idToBranch: { [key: number]: string },
) => {
  const allHits: HitType[] = [];

  users.forEach((user) => {
    const drnLowerCase = user.drnId?.toLowerCase();
    let hitObj: any = {};

    if (vinsByUser[drnLowerCase] !== undefined) {
      hitObj.lenderClientCount = {};

      vinsByUser[drnLowerCase].vins.forEach((vin) => {
        const caseVin = rDNCases.find(
          (rDNCase) => rDNCase.vinLastEight === vin,
        );
        if (caseVin) {
          const { lenderClientName, lenderClientId } = caseVin;

          if (hitObj.lenderClientCount[lenderClientName] !== undefined) {
            hitObj.lenderClientCount[lenderClientName] = {
              ...hitObj.lenderClientCount[lenderClientName],
              value: (hitObj.lenderClientCount[lenderClientName].value += 1),
            };
          } else {
            hitObj.lenderClientCount[lenderClientName] = {
              value: 1,
              id: lenderClientId,
            };
          }
        }
      });
      hitObj.branchName = idToBranch[user.branchId];
      hitObj.count = vinsByUser[drnLowerCase].count;
      hitObj = { ...user, ...hitObj, drnId: user.drnId?.toLowerCase() };
      allHits.push(hitObj);
    }
  });

  return allHits.sort((a, b) => b.count - a.count);
};

export const formatSecuredByUser = (
  rDNCases: RdnCaseType[],
  mapVinsToUser: any,
) => {
  const securedByUser: any = {};

  rDNCases.forEach((secureCase) => {
    const { vinLastEight, lenderClientName, lenderClientId } = secureCase;
    // const userId = mapVinsToUser[vinLastEight];
    const users = mapVinsToUser[vinLastEight];

    for (let index = 0; index < users.length; index++) {
      const userId = users[index];

      if (securedByUser[userId] === undefined) {
        securedByUser[userId] = {
          count: 1,
          lenderClientCount: {
            [lenderClientName]: { value: 1, id: lenderClientId },
          },
        };
      } else {
        if (
          securedByUser[userId].lenderClientCount[lenderClientName] ===
          undefined
        )
          securedByUser[userId].lenderClientCount[lenderClientName] = {
            value: 1,
            id: lenderClientId,
          };
        else
          securedByUser[userId].lenderClientCount[lenderClientName].value += 1;

        securedByUser[userId] = {
          ...securedByUser[userId],
          count: (securedByUser[userId].count += 1),
        };
      }
    }
  });

  return securedByUser;
};

export const sumAndGroupScanByUser = (
  cameraScans: CameraScanType[],
  users: UserType[],
  idToBranch: { [key: number]: string },
): CameraScanType[] => {
  // the users are already being passed filtered
  // users = users.filter(userElem => userElem.drnId !== undefined && userElem.firstName)

  const usersByDrnId: Record<string, UserType> = users.reduce(
    (acc: Record<string, UserType>, user: UserType) => {
      acc[String(user.drnId).toLowerCase()] = user;
      return acc;
    },
    {},
  );

  const cameraScansSumObj: Record<string, Partial<UserType>> = {};
  cameraScans.forEach((cameraScan) => {
    if (cameraScan.drnId === undefined) return;
    if (cameraScan.drnId === '') return;

    const drnId = String(cameraScan.drnId).toLowerCase();
    const sumObject = cameraScansSumObj[drnId];
    if (sumObject !== undefined) {
      sumObject.count =
        sumObject.count === undefined
          ? cameraScan.count
          : sumObject.count + cameraScan.count;
      return;
    }

    const user = usersByDrnId[drnId];
    const newUser: Partial<UserType> = {};
    if (user !== undefined) {
      Object.assign(newUser, {
        ...user,
        count: cameraScan.count,
      });
    } else {
      Object.assign(newUser, {
        branchId: null,
        count: cameraScan.count,
        drnId: drnId,
      });
    }
    cameraScansSumObj[drnId] = newUser;
  });

  const cameraScansByUser = Object.keys(cameraScansSumObj).map((userDrnId) => {
    const user = cameraScansSumObj[userDrnId];
    return {
      ...user,
      branchName:
        user.branchId === undefined ? undefined : idToBranch[user.branchId],
      drnId: userDrnId,
    };
  });

  const results: CameraScanType[] = [];
  for (let i = 0; i < cameraScansByUser.length; i++) {
    if (cameraScansByUser[i].drnId === undefined) {
      continue;
    }
    results.push({
      count: cameraScansByUser[i].count ?? 0,
      drnId: cameraScansByUser[i].drnId,
      branchName: cameraScansByUser[i].branchName,
      // @ts-ignore
      status: cameraScansByUser[i].status,
      firstName: cameraScansByUser[i].firstName,
      lastName: cameraScansByUser[i].lastName,
      email: cameraScansByUser[i].email,
    });
  }

  return results.sort((a, b) => b.count - a.count);
};

export const statusCalc = (
  securedByUserList: any,
  previousSecuredByUserList: any,
) => {
  return securedByUserList.map((caseElem: any) => {
    const { drnId } = caseElem;
    const pCaseElem = previousSecuredByUserList.find(
      (pCaseElem: any) => pCaseElem.drnId === drnId,
    );

    try {
      if (pCaseElem) {
        Object.keys(caseElem.lenderClientCount).forEach((lenderClient) => {
          if (
            caseElem.lenderClientCount[lenderClient] &&
            pCaseElem.lenderClientCount[lenderClient]
          ) {
            caseElem.lenderClientCount[lenderClient].previousValue = 0;

            if (pCaseElem.lenderClientCount[lenderClient].value) {
              caseElem.lenderClientCount[lenderClient].previousValue =
                pCaseElem.lenderClientCount[lenderClient].value;
            }

            //Status calc
            caseElem.count > pCaseElem.count
              ? (caseElem.status = 1)
              : caseElem.count < pCaseElem.count
              ? (caseElem.status = -1)
              : (caseElem.status = 0);
          } else {
            caseElem.status = 1;
          }
        });
      }
    } catch (error) {
      console.log({ error });
    }

    // Black magic
    const caseElemAux = JSON.parse(JSON.stringify(caseElem));
    return caseElemAux;
  });
};

export const statusCalcAllHits = (
  allHits: HitType[],
  previousAllHits: HitType[],
) => {
  return allHits.map((hit) => {
    let { drnId } = hit;
    let previousAllHit = previousAllHits.find(
      (previousAllHit) => previousAllHit.drnId === drnId,
    );

    if (previousAllHit) {
      Object.keys(hit.lenderClientCount).forEach((lenderClient) => {
        if (
          hit.lenderClientCount[lenderClient] &&
          previousAllHit?.lenderClientCount[lenderClient]
        ) {
          hit.lenderClientCount[lenderClient].previousValue =
            previousAllHit?.lenderClientCount[lenderClient].value;
        }
      });

      hit.count > previousAllHit.count
        ? (hit.status = 1)
        : hit.count < previousAllHit.count
        ? (hit.status = -1)
        : (hit.status = 0);
    } else {
      hit.status = 1;
    }

    return hit;
  });
};

export const statusCalcCameraScans = (
  cameraScansList: CameraScanType[],
  previousCameraScansList: CameraScanType[],
) => {
  return cameraScansList.map((cameraScan) => {
    let { drnId } = cameraScan;
    let previousCameraScan = previousCameraScansList.find(
      (cameraScan) => cameraScan.drnId === drnId,
    );

    if (previousCameraScan) {
      cameraScan.count > previousCameraScan.count
        ? (cameraScan.status = 1)
        : cameraScan.count < previousCameraScan.count
        ? (cameraScan.status = -1)
        : (cameraScan.status = 0);
    } else {
      cameraScan.status = 1;
    }
    return cameraScan;
  });
};

export const groupCamerasByBranch = (
  cameras: any,
  idToBranch: { [key: number]: string },
) => {
  let CamerasByBranch: any = {};
  try {
    Object.keys(idToBranch).map((id: any) => {
      CamerasByBranch[idToBranch[id]] = {
        all_hits: cameras.all_hits.filter(
          (hit: any) => hit.branchName === idToBranch[id],
        ),
        scanned: cameras.scanned.filter(
          (scan: any) => scan.branchName === idToBranch[id],
        ),
        secured: cameras.secured.filter(
          (secure: any) => secure.branchName === idToBranch[id],
        ),
      };
    });
  } catch (error) {
    console.log({ error });
  }

  CamerasByBranch['Company Wide'] = cameras;

  // Unknown branch
  CamerasByBranch['Unknown'] = {
    all_hits: CamerasByBranch['Company Wide'].all_hits.filter(
      (hit: any) => hit.branchName === undefined,
    ),
    scanned: CamerasByBranch['Company Wide'].scanned.filter(
      (scan: any) => scan.branchName === undefined,
    ),
    secured: CamerasByBranch['Company Wide'].secured.filter(
      (secure: any) => secure.branchName === undefined,
    ),
  };

  return CamerasByBranch;
};

export const groupCamerasByUser = ({ all_hits, secured, scanned }: any) => {
  const camerasByUser = [];

  // Get the users from scanned
  for (let index = 0; index < scanned.length; index++) {
    const hit = scanned[index];
    const resultObj: any = {};

    // Add user data
    resultObj.user = {
      avatarUrl: hit.avatarUrl,
      branchName: hit.branchName,
      drnId: hit.drnId,
      name: `${hit.firstName} ${hit.lastName}`,
      id: hit.id,
    };

    // Add hit data
    resultObj.scanned = hit;

    // Add scanned data
    const allHits = all_hits.find(
      (scannedItem: any) =>
        scannedItem.drnId?.toLowerCase() === hit.drnId?.toLowerCase(),
    );
    resultObj.allHits = allHits || {};

    // Add secured data
    const securedData = secured.find(
      (securedItem: any) =>
        securedItem.userId.toLowerCase() === hit.drnId?.toLowerCase(),
    );
    resultObj.secured = securedData || {};

    camerasByUser.push(resultObj);
  }

  // Check there are no missing users from secured
  for (let index = 0; index < secured.length; index++) {
    const securedObj = secured[index];
    const resultObj: any = {};

    const isUser = camerasByUser.find(
      (user) =>
        user?.user?.drnId?.toLowerCase() === securedObj?.drnId?.toLowerCase(),
    );

    if (!isUser) {
      resultObj.user = {
        avatarUrl: securedObj.avatarUrl || '',
        branchName: securedObj.branchName || '',
        drnId: securedObj.drnId || '',
        name: securedObj?.firstName
          ? `${securedObj.firstName} ${securedObj.lastName}`
          : 'Unknown User',
        id: securedObj.id || securedObj.userId,
      };

      // Add secured data
      resultObj.secured = securedObj;

      // Add scanned data
      const scannedObj = scanned.find(
        (scannedItem: any) =>
          scannedItem?.drnId?.toLowerCase() ===
          securedObj?.userId?.toLowerCase(),
      );
      resultObj.scanned = scannedObj || {};

      // Add placeholder for all hits
      resultObj.allHits = {};

      camerasByUser.push(resultObj);
    }
  }

  return camerasByUser;
};

/**
 * New helpers for Top Camera Cars -----------------------------------.
 */

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
    const repeatedVins: string[] = [];
    for (let index = 0; index < currentCases.length; index++) {
      const rdnCase = currentCases[index];

      // If vin is repeated, skip
      const vin = rdnCase.vinLastEight;
      const isRepeatedVin = repeatedVins.includes(vin);
      if (isRepeatedVin) {
        continue;
      }
      repeatedVins.push(vin);

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
    const repeatedPreviousVins: string[] = [];
    for (let index = 0; index < previousCases.length; index++) {
      const rdnCase = previousCases[index];

      // If vin is repeated, skip
      const vin = rdnCase.vinLastEight;
      const isRepeatedVin = repeatedPreviousVins.includes(vin);
      if (isRepeatedVin) {
        continue;
      }
      repeatedPreviousVins.push(vin);

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

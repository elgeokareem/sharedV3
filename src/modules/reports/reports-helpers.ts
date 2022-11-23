import {
  CameraHitType,
  CameraScanType,
  HitType,
  RdnCaseType,
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
  return vinsByUser;
};

export const mapVinsToUserAndAllVins = (vinsByUser: {
  [key: string]: { vins: string[] };
}) => {
  let allVins: string[] = [];
  const mapVinsToUser: { [key: string]: string } = {};

  Object.keys(vinsByUser).forEach((userId) => {
    const vins = vinsByUser[userId].vins;
    allVins.push(...vins);
    vins.forEach((vin) => {
      mapVinsToUser[vin] = userId;
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
    const drnLowerCase = user.drnId.toLowerCase();
    let hitObj: any = {};

    if (vinsByUser[drnLowerCase] !== undefined) {
      hitObj.lenderClientCount = {};

      vinsByUser[drnLowerCase].vins.forEach((vin) => {
        const caseVin = rDNCases.find(
          (rDNCase) => rDNCase.vinLastEight === vin,
        );
        if (caseVin) {
          const { lenderClientName, lender_client_id } = caseVin;

          if (hitObj.lenderClientCount[lenderClientName] !== undefined) {
            hitObj.lenderClientCount[lenderClientName] = {
              ...hitObj.lenderClientCount[lenderClientName],
              value: (hitObj.lenderClientCount[lenderClientName].value += 1),
            };
          } else {
            hitObj.lenderClientCount[lenderClientName] = {
              value: 1,
              id: lender_client_id,
            };
          }
        }
      });
      hitObj.branchName = idToBranch[user.branchId];
      hitObj.count = vinsByUser[drnLowerCase].count;
      hitObj = { ...user, ...hitObj, drnId: user.drnId.toLowerCase() };
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
    const { vinLastEight, lenderClientName, lender_client_id } = secureCase;
    const userId = mapVinsToUser[vinLastEight];
    if (securedByUser[userId] === undefined) {
      securedByUser[userId] = {
        count: 1,
        lenderClientCount: {
          [lenderClientName]: { value: 1, id: lender_client_id },
        },
      };
    } else {
      if (
        securedByUser[userId].lenderClientCount[lenderClientName] === undefined
      )
        securedByUser[userId].lenderClientCount[lenderClientName] = {
          value: 1,
          id: lender_client_id,
        };
      else securedByUser[userId].lenderClientCount[lenderClientName].value += 1;

      securedByUser[userId] = {
        ...securedByUser[userId],
        count: (securedByUser[userId].count += 1),
      };
    }
  });

  return securedByUser;
};

export const sumAndGroupScanByUser = (
  cameraScans: CameraScanType[],
  users: UserType[],
  idToBranch: { [key: number]: string },
) => {
  // the users are already being passed filtered
  // users = users.filter(userElem => userElem.drnId !== undefined && userElem.firstName)
  const innerCameraScans = cameraScans.filter((cameraScan) => cameraScan.drnId);

  const cameraScansSumObj: any = {};
  innerCameraScans.forEach((cameraScan) => {
    if (cameraScansSumObj[cameraScan.drnId] === undefined) {
      const user = users.find(
        (innerUser) => innerUser.drnId.toLowerCase() === cameraScan.drnId,
      );
      cameraScansSumObj[cameraScan.drnId] = {
        count: cameraScan.count,
        ...user,
      };
    } else {
      cameraScansSumObj[cameraScan.drnId].count += cameraScan.count;
    }
  });

  const cameraScansByUser = Object.keys(cameraScansSumObj).map((userDrnId) => ({
    drnId: userDrnId,
    ...cameraScansSumObj[userDrnId],
    branchName: idToBranch[cameraScansSumObj[userDrnId].branchId],
  }));

  return cameraScansByUser
    .filter((scan) => scan.firstName)
    .sort((a, b) => b.count - a.count);
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
        scannedItem.drnId.toLowerCase() === hit.drnId.toLowerCase(),
    );
    resultObj.allHits = allHits || {};

    // Add secured data
    const securedData = secured.find(
      (securedItem: any) =>
        securedItem.userId.toLowerCase() === hit.drnId.toLowerCase(),
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

import gql from 'graphql-tag';

export const FETCH_CAMERA_HITS = gql`
  query CameraHits(
    $where: CameraHitWhereInput
    $where1: CameraHitWhereInput
    $where2: CameraScanWhereInput
    $where3: CameraScanWhereInput
  ) {
    cameraHits(where: $where) {
      lpr
      lpr_vins
      direct_hits_vins
      drnId
      count
      scanned_at
    }
    previousCameraHits: cameraHits(where: $where1) {
      lpr_vins
      direct_hits_vins
      drnId
      count
    }
    users {
      id
      drnId
      rdnId
      firstName
      lastName
      avatarUrl
      branchId
    }
    branches {
      id
      name
    }
    cameraScans(where: $where2) {
      scanned_at
      drnId
      count
    }
    previousCameraScans: cameraScans(where: $where3) {
      scanned_at
      drnId
      count
    }
  }
`;

export const FETCH_SECURED_CASES = gql`
  query SecuredCases($where: RDNCaseWhereInput, $where1: RDNCaseWhereInput) {
    rDNCases(where: $where) {
      caseId
      vinLastEight
      lenderClientName
      lenderClientId
      spottedLat
      spottedLng
      repoLat
      repoLng
      status
      spottedAddress
      vin
      vendorBranchName
      vendor_address
      yearMakeModel
      originalOrderDate
      rdnRepoDate
      orderType
      repoAddress
    }
    previousRDNCases: rDNCases(where: $where1) {
      caseId
      vinLastEight
      status
      lenderClientName
      lenderClientId
      status
      vin
      originalOrderDate
    }
  }
`;

export const FETCH_ALL_MISSED_REPOSSESSIONS = gql`
  query AggregateMissedRepossession($where: MissedRepossessionWhereInput) {
    aggregateMissedRepossession(where: $where) {
      _count {
        id
      }
    }
  }
`;

export const FETCH_TARGET_RECOVERY_RATES_BY_USER = gql`
  query TargetRecoveryRates($where: TargetRecoveryRateWhereInput) {
    targetRecoveryRates: targetRecoveryRates(where: $where) {
      branchId
      clientId
      duration
      targetRecoveryRate
      userId
    }
  }
`;

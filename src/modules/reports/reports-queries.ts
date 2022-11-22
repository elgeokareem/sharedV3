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
      status
      lenderClientName
      lender_client_id
      status
    }
    previousRDNCases: rDNCases(where: $where1) {
      caseId
      vinLastEight
      status
      lenderClientName
      lender_client_id
      status
    }
  }
`;

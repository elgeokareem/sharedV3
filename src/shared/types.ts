/* eslint-disable no-unused-vars */

import { DocumentNode } from 'graphql/language';

export enum CASE_STATUSES {
  open = 'Open',
  need_info = 'Need Info',
  pending_close = 'Pending Close',
  pending_on_hold = 'Pending On Hold',
  closed = 'Closed',
  onHold = 'On Hold',
  repossessed = 'Repossessed',
  new_from_client = 'New From Client',
  declinedOrder = 'Declined Order',
}

export enum CASE_STATUSES_RDN_MATCH {
  open = 'Open',
  need_info = 'Need Info',
  pending_close = 'Pending Close',
  pending = 'Pending',
  pending_on_hold = 'Pending On Hold',
  closed = 'Closed',
  onHold = 'On Hold',
  repossessed = 'Repossessed',
}

export enum CASE_ORDER_TYPES {
  // Voluntary
  voluntary = 'Vol. Repo',

  // Involuntary
  investigate = 'Investigate',
  investigateRepo = 'Investigate/Repo',
  lprStaging = 'LPR Staging',
  involuntary = 'Repossess',

  // Impound
  impoundRepo = 'Impound Repo',
  impoundVoluntary = 'Impound Voluntary',

  // Not Categorized: Exclude from voluntary, involuntary, and impound
  condReport = 'Cond. Report',
  pictures = 'Pictures',
  fieldVisit = 'Field Visit',
  invalid = 'Invalid',
  store = 'Store',
  transport = 'Transport',
  declinedOrder = 'Declined Order',
  none = 'None',
  tow = 'Tow',
  convToRepo = 'Conv to Repo',
  auction = 'Auction',
  consign = 'Consign',
}

export enum EVENT_TYPES {
  // Event Types References
  case_status_changed = 100, // 100	CASE STATUS CHANGED
  // 101	ORDER TYPE CHANGED
  update_added = 200, // 200 UPDATE ADDED
  // 201	UPDATE EDITED
  // 202	UPDATE HIDDEN
  // 203	UPDATE UNHIDDEN
  // 204	FIRST UPDATE ADDED CUSTOM
  // 205	BORROWER FIRST UPDATE ADDED
  case_was_repoed = 300, // 300	CASE WAS REPOED
  case_was_repossessed = 300, // 300	CASE WAS REPOSSESSED
  // 301	CASE WAS UNREPOED
  // 302	CASE COMPLETED
  // 303	CASE UNCOMPLETED
  // 304	CASE REOPENED
  case_disposition_changed = 305, // 305	CASE DISPOSITION CHANGED
  new_from_client = 400, // 400 CASE NEW FROM CLIENT
  // 400	ADDED CASE
  // 404	DELETED CASE
  // 500	NEW PLATE
  // 501	CHANGED PLATE
  // 600	ACCEPTED CASE
  // 601	DECLINED CASE
  // 602	ACKNOWLEDGED CLOSE
  // 603	ACKNOWLEDGED HOLD
  // 604	CLOSE REQUESTED
  // 605	HOLD REQUESTED
  // 700	CASE REASSIGNED
  // 701	CASEWORKER CHANGED
  // 703	CLIENT CHANGED
  // 704	INVESTIGATOR CHANGED
  // 706	TRANSPORT DATE CHANGED
  // 707	CR DATE CHANGED
  // 708	STORAGE LOCATION CHANGED
  // 709	DATE VEHICLE LEFT LOT CREATED
  // 710	ADDITIONAL INFO CHANGED
  // 800	INVOICE CREATED
  // 801	INVOICE ITEM CREATED
  // 802	INVOICE UPDATED
  // 803	INVOICE ITEM UPDATED
  // 804	INVOICE DELETED
  // 805	INVOICE ITEM DELETED
  // 806	INVOICE PAYMENT CREATED
  // 807	INVOICE PAYMENT EDITED
  // 808	INVOICE PAYMENT DELETED
  // 809	INVOICE BILL CREATED
  // 810	INVOICE BILL EDITED
  // 811	INVOICE SENT TO CLIENT
  // 900	FAX CREATED
  // 1002	AGENT LOGIN
  // 1003	USER LOGIN
  // 1100	ADDRESS ADDED
  // 1101	ADDRESS UPDATED
  // 1102	ADDRESS INVALIDATED
  // 1103	ADDRESS VALIDATED
  // 1104	ADDRESS DELETED
  // 1200	DOCUMENT ADDED
  // 1201	PHOTO ADDED
  // 1202	DOCUMENT DELETED
  // 1203	PHOTO DELETED
  // 1204	SAVED DOCUMENT ADDED
  // 1205	SAVED DOCUMENT DELETED
  // 1300	CR ADDED
  // 1301	AGENT ADDED
  // 1302	SUBSTATUS ADDED
  // 1303	SUBSTATUS DELETED
  // 1304	AGENT CLOSED
  // 1305	AGENT HOLD
  // 1306	AGENT ACTIVE
  // 1307	AGENT NEED INFO
  // 1308	AGENT REPO
  // 1400	APPROVED BRANCH ADDED
  // 1401	APPROVED BRANCH UPDATED
  // 1402	APPROVED BRANCH DELETED
  branch_added = 1410, // 1410	BRANCH ADDED
  branch_updated = 1411, // 1411	BRANCH UPDATED
  branch_deleted = 1412, // 1412	BRANCH DELETED
  // 1420	BRANCH ZIP ADDED
  // 1421	BRANCH ZIP UPDATED
  // 1422	BRANCH ZIP DELETED
  // 1423	LOCKED BRANCH ZIP ADD QUEUED
  // 1500	COMPANY_PROFILE_UPDATE
  // 1501	COMPANY_PROFILE_ADDED
  // 201401	CASE TRANSFERRED
  // 201402	UPDATE DELETED
  // 201403	VIN CHANGED
  // 201501	DRN INFO ADDED
  // 201502	RECOVERED CASE MODIFIED
}

export type CameraHitType = {
  lpr: number;
  lpr_vins: string;
  direct_hits_vins: string;
  drnId: string;
  count: number;
};

export type UserType = {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone_number: string;
  avatarUrl?: string;
  roleId: number;
  status: string;
  drnId: string;
  branchId: number;
  count: number;
  created_at: string;
  updated_at: string;
};

export type RdnCaseType = {
  vinLastEight: string;
  lenderClientName: string;
  lenderClientId: number;
};

export type CameraScanType = {
  count: number;
  status: number;
  drnId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type HitType = {
  count: number;
  drnId: string;
  status: number;
  lenderClientCount: {
    [key: string]: {
      previousValue: number;
      value: number;
    };
  };
};

export type GraphQLQuery = {
  query: DocumentNode;
  variables?: Record<string, any>;
};
export type GraphQLClient = {
  query: (options: GraphQLQuery) => Promise<any>;
};

export type DriverType = {
  count: number;
  firstName: string;
};

export type Case = {
  caseId:string
}

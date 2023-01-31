import { ParamsType } from "./index";
import { PLANS } from "../constants";

export const advancedPlanValidator = (params: ParamsType) => {
  if (params.plan === PLANS.advanced) return [true, 'Access granted'];
  return [false, 'Access denied'];
};

export const advancedOrBasicPlanValidator = (params: ParamsType) => {
  if (params.plan === PLANS.advanced || params.plan === PLANS.basic) return [true, 'Access granted'];
  return [false, 'Access denied'];
};

export const allPlanValidator = () => [true, 'Access granted'];

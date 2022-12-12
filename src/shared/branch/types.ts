
export type SubBranch = {
  id: number;
  name: string;
  zipCodes: string;
}

export type Branch = {
  id: number;
  name: string;
  subBranches: SubBranch[];
}

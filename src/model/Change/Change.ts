export interface ChangeItem {
  id: string;
  changes: Change[];
}

export interface Change {
  field: string;
  oldValue: any;
  newValue: any;
  serverValue?: any;
  changeId: ChangeId;
}

export interface ServerGetItem {
  id: string;
  changes: ServerGet[];
}

export interface ServerGet {
  field: string;
  serverValue: any;
}

export type ChangeId = string;

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

export type ChangeId = string;

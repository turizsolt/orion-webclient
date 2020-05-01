export enum Updateness {
  Conflict = 'conflict',
  Resolved = 'resolved',
  Local = 'local',
  Editing = 'editing',
  JustUpdated = 'justUpdated',
  UpToDate = 'upToDate'
}

export function updatenessToNumber(u: Updateness): number {
  switch (u) {
    case Updateness.Conflict:
      return 0;
    case Updateness.Resolved:
      return 1;
    case Updateness.Local:
      return 2;
    case Updateness.Editing:
      return 3;
    case Updateness.JustUpdated:
      return 4;
    case Updateness.UpToDate:
      return 5;
    default:
      return -1;
  }
}

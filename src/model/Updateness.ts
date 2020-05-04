export enum Updateness {
  Conflict = 'conflict',
  Resolved = 'resolved',
  Local = 'local',
  GoneLocal = 'goneLocal',
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
    case Updateness.GoneLocal:
      return 3;
    case Updateness.Editing:
      return 4;
    case Updateness.JustUpdated:
      return 5;
    case Updateness.UpToDate:
      return 6;
    default:
      return -1;
  }
}

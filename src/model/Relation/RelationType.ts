export enum RelationType {
  Child = 'child',
  Parent = 'parent',
  Hash = 'hash',
  HashOf = 'hashof',
  Responsible = 'responsible',
  ResponsibleOf = 'responsibleof'
}

export const oppositeOf = (rel: RelationType): RelationType => {
  switch (rel) {
    case RelationType.Child:
      return RelationType.Parent;
    case RelationType.Parent:
      return RelationType.Child;
    case RelationType.Hash:
      return RelationType.HashOf;
    case RelationType.HashOf:
      return RelationType.Hash;
    case RelationType.Responsible:
      return RelationType.ResponsibleOf;
    case RelationType.ResponsibleOf:
      return RelationType.Responsible;
  }
};

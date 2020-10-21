export enum RelationType {
  Child = 'child',
  Parent = 'parent',
  Hash = 'hash',
  HashOf = 'hashof'
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
  }
};

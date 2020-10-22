export enum RelationType {
  Child = 'child',
  Parent = 'parent'
}

export const oppositeOf = (rel: RelationType): RelationType => {
  switch (rel) {
    case RelationType.Child:
      return RelationType.Parent;
    case RelationType.Parent:
      return RelationType.Child;
  }
};

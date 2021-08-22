export enum RelationType {
  Child = 'child',
  Parent = 'parent',
  Hash = 'hash',
  HashOf = 'hashof',
  Responsible = 'responsible',
  ResponsibleOf = 'responsibleof',
  Template = 'template',
  TemplateOf = 'templateof',
  Generated = 'generated',
  GeneratedBy = 'generatedby',
  Copied = 'copied',
  CopiedFrom = 'copiedfrom'
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

    case RelationType.Template:
      return RelationType.TemplateOf;
    case RelationType.TemplateOf:
      return RelationType.Template;

    case RelationType.Generated:
      return RelationType.GeneratedBy;
    case RelationType.GeneratedBy:
      return RelationType.Generated;

    case RelationType.Copied:
      return RelationType.CopiedFrom;
    case RelationType.CopiedFrom:
      return RelationType.Copied;
  }
};

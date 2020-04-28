export const FieldTypeOf = (field: string): string => {
  switch (field) {
    case 'description':
      return 'Text';
    case 'isIt':
      return 'Boolean';
    default:
      return 'String';
  }
};

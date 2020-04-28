export const FieldTypeOf = (field: string): string => {
  switch (field) {
    case 'description':
      return 'Text';
    default:
      return 'String';
  }
};

export const FieldTypeOf = (field: string): { type: string; params?: any } => {
  switch (field) {
    case 'description':
      return { type: 'Text' };
    case 'isIt':
      return { type: 'Boolean' };
    case 'deleted':
      return { type: 'Boolean' };
    case 'count':
      return { type: 'Number' };
    case 'due':
      return { type: 'Date' };
    case 'color':
      return { type: 'Color' };
    case 'state':
      return {
        type: 'Enum',
        params: { values: ['todo', 'doing', 'done'] }
      };
    default:
      return { type: 'String' };
  }
};

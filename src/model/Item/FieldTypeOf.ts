export const FieldTypeOf = (field: string): { type: string; params?: any } => {
  switch (field) {
    case 'description':
      return { type: 'Text' };
    case 'isIt':
      return { type: 'Boolean' };
    case 'state':
      return {
        type: 'Enum',
        params: { values: [undefined, 'todo', 'doing', 'done'] }
      };
    default:
      return { type: 'String' };
  }
};

interface FieldType {
  type: string;
  params?: any;
  getDefaultValue: () => any;
}

interface NamedFieldType extends FieldType {
  name: string;
}

const types: Record<string, FieldType> = {
  title: { type: 'String', getDefaultValue: () => '' },
  priority: { type: 'Number', getDefaultValue: () => 0 },
  description: { type: 'Text', getDefaultValue: () => '' },
  isIt: { type: 'Boolean', getDefaultValue: () => false },
  deleted: { type: 'Boolean', getDefaultValue: () => false },
  count: { type: 'Number', getDefaultValue: () => 0 },
  due: { type: 'Date', getDefaultValue: () => new Date().toISOString() },
  color: { type: 'Color', getDefaultValue: () => '#000000' },
  state: {
    type: 'Enum',
    params: { values: ['todo', 'doing', 'done'] },
    getDefaultValue: () => 'todo'
  },
  default: { type: 'String', getDefaultValue: () => '' }
};

export const FieldTypeOf = (field: string): FieldType => {
  return types[field] || types.default;
};

export const fieldTypeList: NamedFieldType[] = [];
for (const name of Object.keys(types)) {
  fieldTypeList.push({ ...types[name], name });
}

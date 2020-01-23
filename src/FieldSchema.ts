export const fieldSchema = [
  { name: 'title', type: 'string' },
  { name: 'description', type: 'text' },
  { name: 'state', type: 'enum', values: ['todo', 'doing', 'done'] },
  {
    name: 'deadline',
    type: 'date',
    defaultValue: () => new Date().toISOString()
  },
  {
    name: 'createdAt',
    type: 'date',
    readonly: true,
    defaultValue: () => new Date().toISOString()
  }
];

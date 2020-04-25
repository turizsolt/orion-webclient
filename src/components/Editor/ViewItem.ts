export interface ViewItem {
  id: string;
  fields: ViewField[];
}

export interface ViewField {
  name: string;
  type: string;
  value: any;
  params?: any;
}

export const sampleItem: ViewItem = {
  id: '1234567890',
  fields: [
    {
      name: 'title',
      type: 'String',
      value: 'Lorem Ipsum'
    },
    {
      name: 'description',
      type: 'Text',
      value: 'Lorem ipsum sit doloret anum.',
      params: { color: 'green' }
    },
    {
      name: 'state',
      type: 'Enum',
      value: 'todo',
      params: { options: ['todo', 'doing', 'done'] }
    }
  ]
};

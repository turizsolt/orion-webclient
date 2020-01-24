import { Item, StoredItem, StoredItemState } from '../../state/Item';
import { Change, StoredChange, StoredChangeState } from '../../state/Change';

export const item: Item = {
  id: '1',
  fields: {
    title: 'New item',
    createdAt: '2020-01-23T20:37:36.711Z',
    description: '',
    state: 'todo'
  }
};

export const change: Change = {
  type: 'CreateItem',
  id: '1',
  data: {
    item
  }
};

export const returnedChange: Change = {
  ...change
};

export const updateChange: Change = {
  type: 'CreateItem',
  id: '2',
  data: {
    itemId: '1',
    field: 'title',
    oldValue: 'New item',
    newValue: 'Newer value'
  }
};

export const storedItemPending: StoredItem = {
  id: item.id,
  fieldsCentral: item.fields,
  fieldsLocal: { title: 'Newer value' },
  changes: ['2'],
  state: StoredItemState.Changing
};

export const storedItemDone: StoredItem = {
  id: item.id,
  fieldsCentral: { ...item.fields, title: 'Newer value' },
  fieldsLocal: {},
  changes: [],
  state: StoredItemState.Stable
};

export const storedChangeCreate: StoredChange = {
  ...change,
  state: StoredChangeState.Done
};

export const storedChangeUpdatePending: StoredChange = {
  ...updateChange,
  state: StoredChangeState.Pending
};

export const storedChangeUpdateDone: StoredChange = {
  ...updateChange,
  state: StoredChangeState.Done
};

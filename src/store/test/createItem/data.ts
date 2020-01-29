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

export const storedItemPending: StoredItem = {
  id: item.id,
  fieldsCentral: {},
  fieldsLocal: item.fields,
  changes: ['1'],
  state: StoredItemState.Creating
};

export const storedChangePending: StoredChange = {
  ...change,
  state: StoredChangeState.Pending
};

export const storedItemDone: StoredItem = {
  id: item.id,
  fieldsCentral: item.fields,
  fieldsLocal: {},
  changes: [],
  state: StoredItemState.Stable
};

export const storedChangeDone: StoredChange = {
  ...change,
  state: StoredChangeState.Done
};

export const returnedChange: Change = {
  ...change
};

import { Item, StoredItem, StoredItemState } from '../../state/Item';
import { Change, StoredChange, StoredChangeState } from '../../state/Change';

export const parentItem: Item = {
  id: '1',
  fields: {
    title: 'Parent',
    createdAt: '2020-01-23T20:37:36.711Z',
    description: '',
    state: 'todo'
  }
};

export const createParent: Change = {
  type: 'CreateItem',
  id: '2',
  data: {
    item: parentItem
  }
};

export const childItem: Item = {
  id: '3',
  fields: {
    title: 'Child',
    createdAt: '2020-01-23T20:37:36.711Z',
    description: '',
    state: 'todo'
  }
};

export const createChild: Change = {
  type: 'CreateItem',
  id: '4',
  data: {
    item: childItem
  }
};

export const newRelation: Change = {
  type: 'CreateRelation',
  id: '5',
  data: {
    parentId: parentItem.id,
    childId: childItem.id
  }
};

export const storedParentChanging: StoredItem = {
  id: parentItem.id,
  fieldsCentral: parentItem.fields,
  fieldsLocal: { children: [childItem.id] },
  changes: ['5'],
  state: StoredItemState.Changing
};

export const storedChildrenChanging: StoredItem = {
  id: childItem.id,
  fieldsCentral: childItem.fields,
  fieldsLocal: { parents: [parentItem.id] },
  changes: ['5'],
  state: StoredItemState.Changing
};

export const storedParentDone: StoredItem = {
  id: parentItem.id,
  fieldsCentral: { ...parentItem.fields, children: [childItem.id] },
  fieldsLocal: {},
  changes: [],
  state: StoredItemState.Stable
};

export const storedChildrenDone: StoredItem = {
  id: childItem.id,
  fieldsCentral: { ...childItem.fields, parents: [parentItem.id] },
  fieldsLocal: {},
  changes: [],
  state: StoredItemState.Stable
};

export const storedChangePending: StoredChange = {
  ...newRelation,
  state: StoredChangeState.Pending
};

export const storedChangeDone: StoredChange = {
  ...newRelation,
  state: StoredChangeState.Done
};

export const storedCreateParentDone: StoredChange = {
  ...createParent,
  state: StoredChangeState.Done
};

export const storedCreateChildDone: StoredChange = {
  ...createChild,
  state: StoredChangeState.Done
};

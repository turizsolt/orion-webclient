import { Store } from 'redux';
import { ItemId } from '../model/Item/ItemId';
import { StoredItem } from '../model/Item/StoredItem';
import { ChangeItem } from '../model/Change/Change';
import { ViewItem, ViewField } from '../model/Item/ViewItem';
import { updateItem, createList, addToList } from '../ReduxStore/actions';
import { RelationType, oppositeOf } from '../model/Relation/RelationType';
import { FieldTypeOf } from '../model/Item/FieldTypeOf';
import { ActualIdGenerator } from '../idGenerator/ActualIdGenerator';
import { socket } from '../socket';
import { Updateness } from '../model/Updateness';

const idGen = new ActualIdGenerator();

export class LocalStore {
  private store: Record<ItemId, StoredItem>;
  private list: ItemId[];
  private reduxStore: Store;

  constructor(reduxStore: Store) {
    this.store = {};
    this.reduxStore = reduxStore;
    this.list = [];

    for (let key of Object.keys(window.localStorage)) {
      const value = window.localStorage.getItem(key);
      const id = key.substr(5); // "item-${id}"
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
        this.updateItem(id);
        this.list.push(id);
      }
    }
    this.reduxStore.dispatch(createList(this.list));
  }

  createItem(): ItemId {
    const id = idGen.generate();
    this.changeItem({
      id,
      changes: [
        {
          field: 'title',
          oldValue: undefined,
          newValue: 'rndstr'
        },
        {
          field: 'description',
          oldValue: undefined,
          newValue: 'arghhhh'
        },
        {
          field: 'isIt',
          oldValue: undefined,
          newValue: true
        },
        {
          field: 'state',
          oldValue: undefined,
          newValue: 'todo'
        },
        {
          field: 'count',
          oldValue: undefined,
          newValue: '3'
        },
        {
          field: 'due',
          oldValue: undefined,
          newValue: '2020-01-31T11:40'
        },
        {
          field: 'color',
          oldValue: undefined,
          newValue: '#ff7733'
        }
      ]
    });
    return id;
  }

  changeItem(change: ChangeItem): void {
    const { id, changes } = change;

    if (!this.store[id]) {
      const value = window.localStorage.getItem(`item-${id}`);
      if (value) {
        this.store[id] = StoredItem.deserialise(value);
      } else {
        this.store[id] = new StoredItem(id);
      }
      this.list.push(id);
      this.reduxStore.dispatch(addToList(id));
    }
    for (let ch of changes) {
      const { field, newValue } = ch;
      this.store[id].setField(field, newValue);
    }
    this.updateItem(id);
    socket.emit('changeItem', change);
  }

  addRelation(oneSideId: ItemId, relation: RelationType, otherSideId: ItemId) {
    this.store[oneSideId].addRelation(relation, otherSideId);
    this.store[otherSideId].addRelation(oppositeOf(relation), oneSideId);

    this.updateItem(oneSideId);
    this.updateItem(otherSideId);
  }

  updateItem(id: ItemId) {
    const viewItem = this.getView(id);
    this.reduxStore.dispatch(updateItem(viewItem));
    window.localStorage.setItem(`item-${id}`, this.store[id].serialise());
  }

  getView(id: ItemId): ViewItem {
    const viewItem: ViewItem = {
      id,
      fields: [],
      children: this.store[id].getChildren(),
      updateness: Updateness.UpToDate
    };
    for (let field of this.store[id].getFields()) {
      viewItem.fields.push({
        name: field,
        ...FieldTypeOf(field),
        value: this.store[id].getField(field),
        updateness: [
          Updateness.Conflict,
          Updateness.Editing,
          Updateness.JustUpdated,
          Updateness.Local,
          Updateness.UpToDate
        ][(Math.random() * 5) | 0]
      });
    }
    viewItem.updateness = computeUpdateness(viewItem.fields);
    return viewItem;
  }

  get(id: ItemId): StoredItem {
    return this.store[id];
  }
}

function udv(u: Updateness): number {
  switch (u) {
    case Updateness.Conflict:
      return 0;
    case Updateness.Local:
      return 1;
    case Updateness.Editing:
      return 2;
    case Updateness.JustUpdated:
      return 3;
    case Updateness.UpToDate:
      return 4;
    default:
      return -1;
  }
}

function computeUpdateness(fields: ViewField[]): Updateness {
  if (fields.length === 0) return Updateness.UpToDate;
  let min = udv(fields[0].updateness);
  let val = fields[0].updateness;
  for (let i = 1; i < fields.length; i++) {
    if (udv(fields[i].updateness) < min) {
      min = udv(fields[i].updateness);
      val = fields[i].updateness;
    }
  }
  return val;
}

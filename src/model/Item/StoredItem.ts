import { ItemId } from './ItemId';
import { Relation } from '../Relation/Relation';
import { RelationType } from '../Relation/RelationType';
import { Updateness } from '../Updateness';

export interface StoredField {
  updateness: Updateness;
  value: any;
}

export class StoredItem {
  private id: ItemId;
  private fields: Record<string, StoredField>;
  private relations: Relation[];
  private updateness: Updateness;

  constructor(id: ItemId) {
    this.id = id;
    this.fields = {};
    this.relations = [];
    this.updateness = Updateness.UpToDate;
  }

  setField(fieldName: string, value: any) {
    if (!this.fields[fieldName]) {
      this.fields[fieldName] = {
        value: undefined,
        updateness: Updateness.UpToDate
      };
    }
    this.fields[fieldName].value = value;
  }

  setFieldUpdateness(fieldName: string, updateness: Updateness) {
    this.fields[fieldName].updateness = updateness;
    this.updateness = computeUpdateness(this.fields);
  }

  addRelation(type: RelationType, otherSideId: ItemId) {
    this.relations.push({ type, otherSideId });
  }

  getField(fieldName: string) {
    return this.fields[fieldName].value;
  }

  getFieldUpdateness(fieldName: string) {
    return this.fields[fieldName].updateness;
  }

  getUpdateness() {
    return this.updateness;
  }

  getFields(): string[] {
    const fields: string[] = [];
    for (let field of Object.keys(this.fields)) {
      fields.push(field);
    }
    return fields;
  }

  getChildren(): ItemId[] {
    return this.relations
      .filter(x => x.type === RelationType.Child)
      .map(x => x.otherSideId);
  }

  serialise(): string {
    return JSON.stringify({
      id: this.id,
      fields: this.fields,
      relations: this.relations
    });
  }

  static deserialise(json: string): StoredItem {
    const { id, fields, relations } = JSON.parse(json);
    const storedItem = new StoredItem(id);
    for (let key of Object.keys(fields)) {
      storedItem.setField(key, fields[key].value);
      storedItem.setFieldUpdateness(key, fields[key].updateness);
    }
    for (let relation of relations) {
      storedItem.addRelation(relation.type, relation.otherSideId);
    }
    return storedItem;
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

function computeUpdateness(fields: Record<string, StoredField>): Updateness {
  const fieldList: StoredField[] = [];
  for (const key of Object.keys(fields)) {
    fieldList.push(fields[key]);
  }
  if (fieldList.length === 0) return Updateness.UpToDate;
  let min = udv(fieldList[0].updateness);
  let val = fieldList[0].updateness;
  for (let i = 1; i < fieldList.length; i++) {
    if (udv(fieldList[i].updateness) < min) {
      min = udv(fieldList[i].updateness);
      val = fieldList[i].updateness;
    }
  }
  return val;
}

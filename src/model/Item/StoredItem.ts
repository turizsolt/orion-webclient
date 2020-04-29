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
  private auxilaryFields: Record<string, Record<string, any>>;
  private relations: Relation[];
  private updateness: Updateness;

  constructor(id: ItemId) {
    this.id = id;
    this.fields = {};
    this.auxilaryFields = {};
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

  setAuxilaryField(auxName: string, fieldName: string, value: any) {
    this.auxilaryFields[auxName][fieldName] = value;
  }

  getAuxilaryField(auxName: string, fieldName: string) {
    return this.auxilaryFields[auxName][fieldName];
  }

  addAuxilaryField(name: string) {
    if (!this.auxilaryFields[name]) {
      this.auxilaryFields[name] = {};
    }
  }

  removeAuxilaryField(name: string) {
    delete this.auxilaryFields[name];
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

  hasField(fieldName: string): boolean {
    return !!this.fields[fieldName];
  }

  getFieldUpdateness(fieldName: string) {
    return this.fields[fieldName].updateness;
  }

  getUpdateness() {
    return this.updateness;
  }

  countFieldUpdateness(field: string, updateness: Updateness) {
    let count = 0;
    for (let field of Object.keys(this.fields)) {
      if (this.fields[field].updateness === updateness) {
        count++;
      }
    }
    return count;
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
      auxilaryFields: this.auxilaryFields,
      relations: this.relations
    });
  }

  static deserialise(json: string): StoredItem {
    const { id, fields, auxilaryFields, relations } = JSON.parse(json);
    const storedItem = new StoredItem(id);
    for (let key of Object.keys(fields)) {
      storedItem.setField(key, fields[key].value);
      storedItem.setFieldUpdateness(key, fields[key].updateness);
    }
    for (let key of Object.keys(auxilaryFields)) {
      storedItem.addAuxilaryField(key);
      for (let key2 of Object.keys(fields)) {
        storedItem.setAuxilaryField(key, key2, auxilaryFields[key][key2]);
      }
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
    case Updateness.Resolved:
      return 1;
    case Updateness.Local:
      return 2;
    case Updateness.Editing:
      return 3;
    case Updateness.JustUpdated:
      return 4;
    case Updateness.UpToDate:
      return 5;
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

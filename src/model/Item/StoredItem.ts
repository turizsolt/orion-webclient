import { ItemId } from './ItemId';
import { Relation } from '../Relation/Relation';
import { RelationType } from '../Relation/RelationType';

export class StoredItem {
  private id: ItemId;
  private fields: Record<string, any>;
  private relations: Relation[];

  constructor(id: ItemId) {
    this.id = id;
    this.fields = {};
    this.relations = [];
  }

  setField(fieldName: string, value: any) {
    this.fields[fieldName] = value;
  }

  addRelation(type: RelationType, otherSideId: ItemId) {
    this.relations.push({ type, otherSideId });
  }

  getField(fieldName: string) {
    return this.fields[fieldName];
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
      storedItem.setField(key, fields[key]);
    }
    for (let relation of relations) {
      storedItem.addRelation(relation.type, relation.otherSideId);
    }
    return storedItem;
  }
}

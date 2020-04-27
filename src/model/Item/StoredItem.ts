import { ItemId } from './ItemId';

export class StoredItem {
  private id: ItemId;
  private fields: Record<string, any>;

  constructor(id: ItemId) {
    this.id = id;
    this.fields = {};
  }

  setField(fieldName: string, value: any) {
    this.fields[fieldName] = value;
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

  serialise(): string {
    return JSON.stringify({
      id: this.id,
      fields: this.fields
    });
  }

  static deserialise(json: string): StoredItem {
    const { id, fields } = JSON.parse(json);
    const storedItem = new StoredItem(id);
    for (let key of Object.keys(fields)) {
      storedItem.setField(key, fields[key]);
    }
    return storedItem;
  }
}

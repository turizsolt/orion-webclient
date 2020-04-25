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
}

import { ItemId } from './ItemId';
import { Relation } from '../Relation/Relation';
import { RelationType } from '../Relation/RelationType';
import { Updateness, updatenessToNumber } from '../Updateness';
import { ItemChange } from '../Change/Change';
import { OURS, THEIRS } from '../OursTheirs';
import { HashtagInfo, ResponsibleInfo, TemplateInfo } from './ViewItem';

export interface StoredField {
  updateness: Updateness;
  value: any;
  change?: ItemChange;
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

  setFieldChange(fieldName: string, change: ItemChange) {
    this.fields[fieldName].change = change;
  }

  getFieldChange(fieldName: string): ItemChange | undefined {
    return this.fields[fieldName].change;
  }

  removeFieldChange(fieldName: string) {
    delete this.fields[fieldName].change;
  }

  setAuxilaryField(auxName: string, fieldName: string, value: any) {
    this.auxilaryFields[auxName][fieldName] = value;
  }

  getAuxilaryField(auxName: string, fieldName: string) {
    return (
      this.auxilaryFields[auxName] && this.auxilaryFields[auxName][fieldName]
    );
  }

  addAuxilaryField(name: string) {
    if (!this.auxilaryFields[name]) {
      this.auxilaryFields[name] = {};
    }
  }

  removeAuxilaryField(name: string) {
    delete this.auxilaryFields[name];
  }

  getAuxilaryNames() {
    const names = [];
    for (const key of Object.keys(this.auxilaryFields)) {
      names.push(key);
    }
    return names;
  }

  setFieldUpdateness(fieldName: string, updateness: Updateness) {
    this.fields[fieldName].updateness = updateness;
    this.computeUpdateness();
  }

  hasRelation(type: RelationType, otherSideId: ItemId) {
    const index = this.relations.findIndex(
      x => x.type === type && x.otherSideId === otherSideId
    );
    return index > -1;
  }

  getRelations(): Relation[] {
    return this.relations;
  }

  getOriginalFields(): Record<string, any> {
    return this.fields;
  }

  addRelation(type: RelationType, otherSideId: ItemId) {
    const index = this.relations.findIndex(
      x => x.type === type && x.otherSideId === otherSideId
    );
    if (index === -1) {
      this.relations.push({ type, otherSideId, updateness: Updateness.Local });
    }
  }

  addRelationAccepted(type: RelationType, otherSideId: ItemId) {
    const index = this.relations.findIndex(
      x => x.type === type && x.otherSideId === otherSideId
    );
    if (index > -1) {
      this.relations[index] = {
        type,
        otherSideId,
        updateness: Updateness.UpToDate
      };
    }
  }

  removeRelation(type: RelationType, otherSideId: ItemId) {
    const index = this.relations.findIndex(
      x => x.type === type && x.otherSideId === otherSideId
    );
    if (index > -1) {
      this.relations[index] = {
        type,
        otherSideId,
        updateness: Updateness.GoneLocal
      };
    }
  }

  removeRelationAccepted(type: RelationType, otherSideId: ItemId) {
    this.relations = this.relations.filter(
      x => !(x.type === type && x.otherSideId === otherSideId)
    );
  }

  getField(fieldName: string) {
    return this.fields[fieldName] && this.fields[fieldName].value;
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

  countFieldUpdateness(updateness: Updateness) {
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

  getParents(): ItemId[] {
    return this.relations
      .filter(x => x.type === RelationType.Parent)
      .map(x => x.otherSideId);
  }

  getHashtags(): ItemId[] {
    return this.relations
      .filter(x => x.type === RelationType.Hash)
      .map(x => x.otherSideId);
  }

  getHashtagInfo(): HashtagInfo {
    return {
      hashtag: this.getField('hashtag'),
      color: this.getField('color'),
      id: this.id
    };
  }

  getResponsibles(): ItemId[] {
    return this.relations
      .filter(x => x.type === RelationType.Responsible)
      .map(x => x.otherSideId);
  }

  getResponsibleInfo(): ResponsibleInfo {
    return {
      username: this.getField('username'),
      id: this.id
    };
  }

  getTemplates(): ItemId[] {
    return this.relations
      .filter(x => x.type === RelationType.Template)
      .map(x => x.otherSideId);
  }

  getTemplateInfo(): TemplateInfo {
    return {
      title: this.getField('title'),
      id: this.id
    };
  }

  private computeUpdateness(): void {
    const fieldList: StoredField[] = this.getFields().map(f => this.fields[f]);

    if (fieldList.length === 0) {
      this.updateness = Updateness.UpToDate;
    } else {
      let min = updatenessToNumber(fieldList[0].updateness);
      let val = fieldList[0].updateness;
      for (let i = 1; i < fieldList.length; i++) {
        if (updatenessToNumber(fieldList[i].updateness) < min) {
          min = updatenessToNumber(fieldList[i].updateness);
          val = fieldList[i].updateness;
        }
      }
      this.updateness = val;
    }
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

  /*** higher order ***/

  setConflict(field: string, oursValue: any, theirsValue: any): void {
    this.setFieldUpdateness(field, Updateness.Conflict);

    this.addAuxilaryField(OURS);
    this.setAuxilaryField(OURS, field, oursValue);

    this.addAuxilaryField(THEIRS);
    this.setAuxilaryField(THEIRS, field, theirsValue);
  }

  willConflict(field: string, serverValue: any): boolean {
    return this.hasField(field) && this.getField(field) !== serverValue;
  }

  updateJustUpdatesToUpToDate(): void {
    for (let field of Object.keys(this.fields)) {
      if (this.fields[field].updateness === Updateness.JustUpdated) {
        this.setFieldUpdateness(field, Updateness.UpToDate);
      }
    }
  }

  hasConflict(field: string): boolean {
    return (
      this.hasField(field) &&
      this.getFieldUpdateness(field) === Updateness.Conflict
    );
  }

  resolveConflict(field: string): void {
    this.setFieldUpdateness(field, Updateness.Resolved);
    if (this.countFieldUpdateness(Updateness.Conflict) === 0) {
      this.removeAuxilaryField(OURS);
      this.removeAuxilaryField(THEIRS);
    }
  }
}

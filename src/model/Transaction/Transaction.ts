import { Change } from '../Change/Change';

export class Transaction {
  private changes: Change[];
  constructor() {
    this.changes = [];
  }

  add(change: Change) {
    this.changes.push(change);
  }

  getChanges(): Change[] {
    return this.changes;
  }
}

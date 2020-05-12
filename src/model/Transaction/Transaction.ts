import { Change } from '../Change/Change';
import { TransactionId } from './TransactionId';
import { ActualIdGenerator } from '../../idGenerator/ActualIdGenerator';

const idGen = new ActualIdGenerator();

export class Transaction {
  private changes: Change[];
  private id: TransactionId;
  constructor(id?: TransactionId) {
    this.changes = [];
    this.id = id || idGen.generate();
  }

  add(change: Change) {
    this.changes.push(change);
  }

  getChanges(): Change[] {
    return this.changes;
  }

  getId(): TransactionId {
    return this.id;
  }
}

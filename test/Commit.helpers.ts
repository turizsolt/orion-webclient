import { Store } from '../src/LocalStore/Store';
import { VoidDispatcher } from '../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../src/LocalStore/VoidLocalStorage';
import { VoidServerCommunication } from '../src/LocalStore/VoidServerCommunication';
import { Change, ChangeResponse, ItemChange } from '../src/model/Change/Change';
import { Transaction } from '../src/model/Transaction/Transaction';
import { ActualIdGenerator } from '../src/idGenerator/ActualIdGenerator';
import { ItemId } from '../src/model/Item/ItemId';
import { FieldName } from '../src/model/Item/FieldName';
import { ChangeId } from '../src/model/Change/ChangeId';
import { TransactionId } from '../src/model/Transaction/TransactionId';

const idGen = new ActualIdGenerator();

export const createStore = (): Store => {
  return new Store(
    new VoidDispatcher(),
    new VoidLocalStorage(),
    new VoidServerCommunication()
  );
};

interface ItemChangeTransaction {
  itemId: ItemId;
  change: ItemChange;
  changeId: ChangeId;
  transaction: Transaction;
}

export const commitItemChange = (
  store: Store,
  props: {
    newValue: any;
    itemId?: ItemId;
    field?: FieldName;
    oldValue?: any;
    changeId?: ChangeId;
    response?: ChangeResponse;
    transactionId?: TransactionId;
  }
): ItemChangeTransaction => {
  const change: Change = {
    type: 'ItemChange',
    itemId: props.itemId || idGen.generate(),
    field: props.field || FIELD,
    oldValue: props.oldValue || undefined,
    newValue: props.newValue,
    changeId: props.changeId || idGen.generate(),
    response: props.response || ChangeResponse.Pending
  };
  const transaction = new Transaction(props.transactionId);
  transaction.add(change);
  store.commit(transaction);
  return {
    itemId: change.itemId,
    changeId: change.changeId,
    change,
    transaction
  };
};

export const LOREM_IPSUM = 'Lorem Ipsum';
export const SOMETHING_ELSE = 'Something Else';
export const FIELD = 'title';

import { Store as ReduxStore } from 'redux';
import { Dispatcher } from './Dispatcher';

export class ReduxDispatcher implements Dispatcher {
  constructor(private reduxStore: ReduxStore) {}
  dispatch(x: any): void {
    this.reduxStore.dispatch(x);
  }
}

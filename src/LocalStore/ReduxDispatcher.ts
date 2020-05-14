import { Store as ReduxStore } from 'redux';

export class ReduxDispatcher {
  constructor(private reduxStore: ReduxStore) {}
  dispatch(x: any): void {
    this.reduxStore.dispatch(x);
  }
}

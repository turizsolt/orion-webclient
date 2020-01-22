import { all, takeEvery } from 'redux-saga/effects';
import { socket } from './socket';

function createItem(action: any) {
  socket.emit('createItem', action.payload);
}

const mySagaCreateItem = function*() {
  yield takeEvery('CREATE_ITEM', createItem);
};

export const mySagas = function* mySaga() {
  yield all([mySagaCreateItem()]);
};

import { all, takeEvery } from 'redux-saga/effects';
import { socket } from './socket';

function createItem(action: any) {
  socket.emit('createItem', action.payload);
}

const mySagaCreateItem = function*() {
  yield takeEvery('CREATE_ITEM', createItem);
};

function updateItem(action: any) {
  socket.emit('updateItem', action.payload);
}

const mySagaUpdateItem = function*() {
  yield takeEvery('UPDATE_ITEM', updateItem);
};

export const mySagas = function* mySaga() {
  yield all([mySagaCreateItem(), mySagaUpdateItem()]);
};

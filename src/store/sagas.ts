import { socket } from './socket';
import { all, takeEvery, call } from 'redux-saga/effects';
import { createItem, updateItem } from './actions';

function createItemWorker(action: any) {
  socket.emit('createItem', action.payload);
}

function* watchCreateItem() {
  yield takeEvery(createItem.started, createItemWorker);
}

function updateItemWorker(action: any) {
  socket.emit('updateItem', action.payload);
}

const watchUpdateItem = function*() {
  yield takeEvery(updateItem.started, updateItemWorker);
};

export const mySagas = function* mySaga() {
  yield all([watchCreateItem(), watchUpdateItem()]);
};

/*
function getAllItem(action: any) {
  socket.emit('getAllItem', action.payload);
}

const mySagaGetAllItem = function*() {
  yield takeEvery('GET_ALL_ITEM', getAllItem);
};
*/

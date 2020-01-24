import { socket } from './socket';
import { all, takeEvery, call } from 'redux-saga/effects';
import { createItem } from './actions';

function createItemWorker(action: any) {
  socket.emit('createItem', action.payload);
}

function* watchCreateItem() {
  yield takeEvery(createItem.started, createItemWorker);
}

export const mySagas = function* mySaga() {
  yield all([watchCreateItem()]);
};

/*
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

function getAllItem(action: any) {
  socket.emit('getAllItem', action.payload);
}

const mySagaGetAllItem = function*() {
  yield takeEvery('GET_ALL_ITEM', getAllItem);
};

export const mySagas = function* mySaga() {
  yield all([mySagaCreateItem(), mySagaUpdateItem(), mySagaGetAllItem()]);
};
*/

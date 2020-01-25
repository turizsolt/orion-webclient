import { socket } from './socket';
import { all, takeEvery } from 'redux-saga/effects';
import {
  createItem,
  updateItem,
  getAllItem,
  getItem,
  createRelation
} from './actions';

function createItemWorker(action: any) {
  socket.emit('createItem', action.payload);
}

function* watchCreateItem() {
  yield takeEvery(createItem.started, createItemWorker);
}

function createRelationWorker(action: any) {
  socket.emit('createRelation', action.payload);
}

function* watchCreateRelation() {
  yield takeEvery(createRelation.started, createRelationWorker);
}

function updateItemWorker(action: any) {
  socket.emit('updateItem', action.payload);
}

const watchUpdateItem = function*() {
  yield takeEvery(updateItem.started, updateItemWorker);
};

function getAllItemWorker(action: any) {
  socket.emit('getAllItem', action.payload);
}

const watchGetAllItem = function*() {
  yield takeEvery(getAllItem.started, getAllItemWorker);
};

function getItemWorker(action: any) {
  socket.emit('getItem', action.payload);
}

const watchGetItem = function*() {
  yield takeEvery(getItem.started, getItemWorker);
};

export const mySagas = function* mySaga() {
  yield all([
    watchCreateItem(),
    watchCreateRelation(),
    watchUpdateItem(),
    watchGetAllItem(),
    watchGetItem()
  ]);
};

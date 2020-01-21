import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { RootState, socket } from '.';
// import { apiFetchUser, apiSubmit } from '../api/api';
// import { PreferenceState } from './state/PreferenceState';

function* createItem(action: any) {
  socket.emit('createItem', action.payload);
}

const mySagaCreateItem = function*() {
  yield takeEvery('CREATE_ITEM', createItem);
};

export const mySagas = function* mySaga() {
  yield all([mySagaCreateItem()]);
};

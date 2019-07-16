import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import {ActionTypes, SetCommandAction} from './actions';

function* handleSetCommand(action:SetCommandAction) {
    console.log('sagged it');
    yield call(console.log, 'sagged: ', action);
    /*
    try {
        const response = yield call<(fromtype) => Promise<{totype}>>(api, params);
        yield put(xFetched(response));
    } catch (e) {
        yield put(xFetchFailed());
    }
    */
}

function* watchSetCommand() {
    yield takeEvery(ActionTypes.SET_COMMAND, handleSetCommand);
}

export function* commandSaga() {
    yield all([
        fork(watchSetCommand),
    ]);
}

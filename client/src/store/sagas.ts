import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import {ActionTypes, SetCommandAction} from './actions';
import {CommandInterpreter} from "../logic/CommandInterpreter/CommandInterpreter";

function* handleSetCommand(action:SetCommandAction) {
    const result = yield call(CommandInterpreter.interpret, action.payload.command);
    if(result) yield put(result());
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

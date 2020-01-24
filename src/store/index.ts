import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appReducer } from './reducer';
import { mySagas } from './sagas';

export const rootReducer = combineReducers({ appReducer });

export type RootState = ReturnType<typeof rootReducer>;

export const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySagas);

import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appReducer } from './reducer';
import { mySagas } from './sagas';
import openSocket from 'socket.io-client';

const rootReducer = combineReducers({ appReducer });

export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySagas);

export const socket = openSocket('http://localhost:3000');

const addItem = (item: any) => {
  store.dispatch({ type: 'CREATED_ITEM', payload: item });
};

socket.on('createdItem', addItem);
socket.on('gotItem', addItem);
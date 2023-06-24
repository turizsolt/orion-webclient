import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appReducer } from './reducer';

export const rootReducer = combineReducers({ appReducer });

export type RootState = ReturnType<typeof rootReducer>;

export const sagaMiddleware = createSagaMiddleware();

declare var reduxDevTools : any;
const composeEnhancers = reduxDevTools || compose;
export const twoStore = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

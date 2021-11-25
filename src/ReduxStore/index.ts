import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appReducer } from './reducer';

export const rootReducer = combineReducers({ appReducer });

export type RootState = ReturnType<typeof rootReducer>;

export const sagaMiddleware = createSagaMiddleware();

declare var window: any;
const composeEnhancers = /* window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || */ compose;
export const twoStore = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

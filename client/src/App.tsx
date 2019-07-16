import React from 'react';
import './App.css';
// import {Rester} from "./components/Rester";
import {Test} from "./components/Test";
import {applyMiddleware, createStore} from "redux";
import reducer from "./store/reducer";
import createSagaMiddleware from 'redux-saga';
import {commandSaga} from "./store/sagas";
import { composeWithDevTools } from 'redux-devtools-extension';

declare var window: any;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(commandSaga);


const App: React.FC = () => {
  return (
    <Test />
  );
};

export default App;

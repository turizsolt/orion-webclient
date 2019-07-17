import React from 'react';
import './App.css';
import {applyMiddleware, combineReducers, createStore} from "redux";
import reducer from "./store/reducer";
import createSagaMiddleware from 'redux-saga';
import {commandSaga} from "./store/sagas";
import { composeWithDevTools } from 'redux-devtools-extension';
import {CommandLineContainer} from "./components/CommandLine";
import {CommanderState} from "./store/model";
import {Provider} from "react-redux";

declare var window: any;

export interface AppState {
    command: CommanderState;
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    combineReducers({ command: reducer}),
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(commandSaga);


const App: React.FC = () => {
  return (
      <Provider store={store}>
          <CommandLineContainer />
      </Provider>
  );
};

export default App;

import React from 'react';
import './App.css';
// import {Rester} from "./components/Rester";
import {Test} from "./components/Test";
import {createStore} from "redux";
import reducer from "./store/reducer";

declare var window: any;

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const App: React.FC = () => {
  return (
    <Test />
  );
};

export default App;

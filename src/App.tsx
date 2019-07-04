import React from 'react';
import {TodoLister} from "./components/TodoLister";
import {TodoModel} from "./model/TodoModel";

const list:TodoModel[] = [
  {description: 'one dfsgdfg'},
  {description: 'two sdfgdfg'},
  {description: 'three lkljlkkl'},
];

const App: React.FC = () => {
    return (
        <div>
            <TodoLister list={list} />
        </div>
    );
}

export default App;

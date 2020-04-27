import React, { useContext, useCallback } from 'react';
import { Provider, useStore, useSelector } from 'react-redux';
import {} from './socket';
import { Route, Switch, useParams, BrowserRouter } from 'react-router-dom';
import { ItemViewer } from './components/Item/ItemViewer';
import { LocalStore } from './LocalStore/LocalStore';
import { ItemId } from './model/Item/ItemId';
import { twoStore } from './ReduxStore';
import { ActualIdGenerator } from './idGenerator/ActualIdGenerator';

const idGen = new ActualIdGenerator();

const Par: React.FC = () => {
  const { items, list } = useSelector((state: any) => state.appReducer);
  const local: LocalStore = useContext(LocalStoreContext);

  const handleClick = useCallback(() => {
    const id = idGen.generate();
    local.change({
      id,
      fieldName: 'title',
      oldValue: undefined,
      newValue: 'rndstr'
    });
    local.change({
      id: id,
      fieldName: 'description',
      oldValue: undefined,
      newValue: 'arghhhh'
    });
  }, [local]);

  return (
    <div>
      {list.map((id: ItemId) => (
        <ItemViewer key={id} item={items[id]} />
      ))}
      <button onClick={handleClick}>Add</button>
    </div>
  );
};

const localStore = new LocalStore(twoStore);

export const LocalStoreContext = React.createContext(localStore);

const App: React.FC = () => {
  return (
    <Provider store={twoStore}>
      <LocalStoreContext.Provider value={localStore}>
        <Par />
      </LocalStoreContext.Provider>
    </Provider>
  );
};

export default App;

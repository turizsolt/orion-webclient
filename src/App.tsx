import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { LocalStore } from './LocalStore/LocalStore';
import { twoStore } from './ReduxStore';
import { RootItemViewer } from './components/Item/RootItemViewer';
import { OneItemViewer } from './components/Item/OneItemViewer';

const localStore = new LocalStore(twoStore);

export const LocalStoreContext = React.createContext(localStore);

const App: React.FC = () => {
  return (
    <Provider store={twoStore}>
      <LocalStoreContext.Provider value={localStore}>
        <BrowserRouter>
          <Switch>
            <Route path="/:id">
              <OneItemViewer />
            </Route>
            <Route exact path="/">
              <RootItemViewer />
            </Route>
          </Switch>
        </BrowserRouter>
      </LocalStoreContext.Provider>
    </Provider>
  );
};

export default App;

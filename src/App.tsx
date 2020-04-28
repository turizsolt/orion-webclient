import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { LocalStore } from './LocalStore/LocalStore';
import { twoStore } from './ReduxStore';
import { RootItemViewer } from './components/Item/RootItemViewer';
import { OneItemViewer } from './components/Item/OneItemViewer';
import { style } from 'typestyle';

const localStore = new LocalStore(twoStore);

export const LocalStoreContext = React.createContext(localStore);

const appStyle = style({ margin: '10px' });

const App: React.FC = () => {
  return (
    <div className={appStyle}>
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
    </div>
  );
};

export default App;

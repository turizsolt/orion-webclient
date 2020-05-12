import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Actions } from './LocalStore/Actions';
import { twoStore } from './ReduxStore';
import { RootItemViewer } from './components/Item/RootItemViewer';
import { OneItemViewer } from './components/Item/OneItemViewer';
import { style } from 'typestyle';
import { ActualIdGenerator } from './idGenerator/ActualIdGenerator';
import { ReduxDispatcher } from './LocalStore/ReduxDispatcher';

const dispatcher = new ReduxDispatcher(twoStore);
const actions = new Actions(dispatcher);
export const idGen = new ActualIdGenerator();

export const ActionsContext = React.createContext(actions);

const appStyle = style({ margin: '10px' });

const App: React.FC = () => {
  return (
    <div className={appStyle}>
      <button onClick={() => localStorage.clear()}>Clear localstorage</button>
      <Provider store={twoStore}>
        <ActionsContext.Provider value={actions}>
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
        </ActionsContext.Provider>
      </Provider>
    </div>
  );
};

export default App;

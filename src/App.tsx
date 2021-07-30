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
import { DefaultLocalStorage } from './LocalStore/DefaultLocalStorage';
import { SocketServerCommunication } from './LocalStore/SocketServerCommunication';
import { socket } from './socket';
import { Changes } from './Changes';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { SprintViewer } from './components/Item/SprintViewer';
import { CategoryViewer } from './components/Item/CategoryViewer';

const dispatcher = new ReduxDispatcher(twoStore);
const actions = new Actions(
  dispatcher,
  new DefaultLocalStorage(),
  new SocketServerCommunication(socket)
);
export const idGen = new ActualIdGenerator();

export const ActionsContext = React.createContext(actions);

const appStyle = style({ margin: '10px' });

const App: React.FC = () => {
  return (
    <div className={appStyle}>
      <button onClick={() => localStorage.clear()}>Clear localstorage</button>
      <hr />
      <Provider store={twoStore}>
        <DndProvider options={HTML5toTouch}>
          <ActionsContext.Provider value={actions}>
            <BrowserRouter>
              <Switch>
                <Route path="/sprint/:id">
                  <SprintViewer />
                </Route>
                <Route path="/category/:id">
                  <CategoryViewer />
                </Route>
                <Route path="/:id">
                  <OneItemViewer />
                </Route>
                <Route exact path="/">
                  <RootItemViewer />
                  <Changes />
                </Route>
              </Switch>
            </BrowserRouter>
          </ActionsContext.Provider>
        </DndProvider>
      </Provider>
    </div>
  );
};

export default App;

export const ItemTypes = {
  ITEM: 'item'
};

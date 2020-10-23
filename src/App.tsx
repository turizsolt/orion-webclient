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
import { Search } from './components/Item/Options/Search';

const dispatcher = new ReduxDispatcher(twoStore);
const actions = new Actions(
  dispatcher,
  new DefaultLocalStorage(),
  new SocketServerCommunication(socket)
);
export const idGen = new ActualIdGenerator();

export const ActionsContext = React.createContext(actions);

const appStyle = style({ 
  //margin: '10px',
  fontSize: '12px',
  fontFamily: 'sans-serif',
  color: 'var(--dark-color)',
});

const headerStyle = style({
  paddingLeft: '10px',
  backgroundColor: 'var(--dark-color)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  color: 'var(--main-color)'
});

const bodyStyle = style({
  margin:'10px'
});

const buttonStyle = style({
  backgroundColor: 'var(--main-color)',
  border: 'none',
  color: 'var(--dark-color)',
  padding: '15px',
  borderRadius: '20px'
});

const App: React.FC = () => {
  return (
    <div>
      
      <div className={appStyle}>
        <Provider store={twoStore}>
          <DndProvider options={HTML5toTouch}>
            <ActionsContext.Provider value={actions}>
              <div className={headerStyle}>
                <button onClick={() => localStorage.clear()} className={buttonStyle}>Clear localstorage</button>
                <Search />
              </div>
              <div className={bodyStyle}>
              <BrowserRouter>
                <Switch>
                  <Route path="/sprint/:id">
                    <SprintViewer />
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
              </div>
            </ActionsContext.Provider>
          </DndProvider>
        </Provider>
      </div>
    </div>
  );
};

export default App;

export const ItemTypes = {
  ITEM: 'item'
};

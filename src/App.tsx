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

  fontFamily: 'sans-serif',
  //color: '#555B6E',
});

const headerStyle = style({
  paddingLeft: '10px',
  backgroundColor: '#555B6E',
  display: 'flex',
  alignItems: 'flex-end'
});

const bodyStyle = style({
  margin:'10px'
});

const buttonStyle = style({
  backgroundColor: '#bee3db',
  border: 'none',
  color: '#555B6E',
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

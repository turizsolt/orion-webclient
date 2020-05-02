import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { LocalStore } from './LocalStore/LocalStore';
import { twoStore } from './ReduxStore';
import { RootItemViewer } from './components/Item/RootItemViewer';
import { OneItemViewer } from './components/Item/OneItemViewer';
import { style } from 'typestyle';
import { socket } from './socket';
import { ChangeItem, ServerGetItem, ChangeId } from './model/Change/Change';
import { ActualIdGenerator } from './idGenerator/ActualIdGenerator';
import { ItemId } from './model/Item/ItemId';
import { RelationType } from './model/Relation/RelationType';

const localStore = new LocalStore(twoStore);
export const idGen = new ActualIdGenerator();

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

socket.on('changeItemAccepted', (data: ChangeItem) => {
  localStore.changeItemAccepted(data);
});

socket.on('changeItemHappened', (data: ChangeItem) => {
  localStore.changeItemHappened(data);
});

socket.on('changeItemConflicted', (data: ChangeItem) => {
  localStore.changeItemConflicted(data);
});

socket.on('allItem', (data: ServerGetItem[]) => {
  localStore.allItem(data);
});

type RelationChange = {
  oneSideId: ItemId;
  relation: RelationType;
  otherSideId: ItemId;
  changeId: ChangeId;
};

socket.on('addRelationAccepted', (data: RelationChange) => {
  localStore.addRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('addRelationAlreadyExists', (data: RelationChange) => {
  localStore.addRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('addRelationHappened', (data: RelationChange) => {
  localStore.addRelationHappened(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('removeRelationAccepted', (data: RelationChange) => {
  localStore.removeRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('removeRelationAlreadyExists', (data: RelationChange) => {
  localStore.removeRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('removeRelationHappened', (data: RelationChange) => {
  localStore.removeRelationHappened(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

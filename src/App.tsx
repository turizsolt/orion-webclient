import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Actions } from './LocalStore/Actions';
import { twoStore } from './ReduxStore';
import { RootItemViewer } from './components/Item/RootItemViewer';
import { OneItemViewer } from './components/Item/OneItemViewer';
import { style } from 'typestyle';
import { socket } from './socket';
import { ChangeItem, ServerGetItem, ChangeId } from './model/Change/Change';
import { ActualIdGenerator } from './idGenerator/ActualIdGenerator';
import { ItemId } from './model/Item/ItemId';
import { RelationType } from './model/Relation/RelationType';

const actions = new Actions(twoStore);
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

socket.on('changeItemAccepted', (data: ChangeItem) => {
  actions.changeItemAccepted(data);
});

socket.on('changeItemHappened', (data: ChangeItem) => {
  actions.changeItemHappened(data);
});

socket.on('changeItemConflicted', (data: ChangeItem) => {
  actions.changeItemConflicted(data);
});

socket.on('allItem', (data: ServerGetItem[]) => {
  actions.allItem(data);
});

type RelationChange = {
  oneSideId: ItemId;
  relation: RelationType;
  otherSideId: ItemId;
  changeId: ChangeId;
};

socket.on('addRelationAccepted', (data: RelationChange) => {
  actions.addRelationAccepted(data.oneSideId, data.relation, data.otherSideId);
});

socket.on('addRelationAlreadyExists', (data: RelationChange) => {
  actions.addRelationAccepted(data.oneSideId, data.relation, data.otherSideId);
});

socket.on('addRelationHappened', (data: RelationChange) => {
  actions.addRelationHappened(data.oneSideId, data.relation, data.otherSideId);
});

socket.on('removeRelationAccepted', (data: RelationChange) => {
  actions.removeRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('removeRelationAlreadyExists', (data: RelationChange) => {
  actions.removeRelationAccepted(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

socket.on('removeRelationHappened', (data: RelationChange) => {
  actions.removeRelationHappened(
    data.oneSideId,
    data.relation,
    data.otherSideId
  );
});

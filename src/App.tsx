import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {} from './store/socket';
import { ItemList } from './components/ItemList';
import { Route, Switch, useParams, BrowserRouter } from 'react-router-dom';
import { ItemWrapper } from './components/ItemWrapper';

const Ch: React.FC = () => {
  const { id } = useParams();

  return <ItemWrapper id={id as string} />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <ItemList />
          </Route>
          <Route path="/kobak">
            <div>Kobak</div>
          </Route>
          <Route path="/:id">
            <Ch />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {} from './store/socket';
import { ItemList } from './components/ItemList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ItemList />
    </Provider>
  );
};

export default App;

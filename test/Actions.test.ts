import { expect } from 'chai';
import { VoidDispatcher } from '../src/LocalStore/VoidDispatcher';
import { VoidLocalStorage } from '../src/LocalStore/VoidLocalStorage';
import { VoidServerCommunication } from '../src/LocalStore/VoidServerCommunication';
import { Actions } from '../src/LocalStore/Actions';

describe('Actions', () => {
  it('create an item', () => {
    const actions = new Actions(
      new VoidDispatcher(),
      new VoidLocalStorage(),
      new VoidServerCommunication()
    );
    const itemId = actions.createItem('title', '');

    const store = actions.getStore();

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField('title')).equals('');
  });

  it('change an item', () => {
    const actions = new Actions(
      new VoidDispatcher(),
      new VoidLocalStorage(),
      new VoidServerCommunication()
    );
    const itemId = actions.createItem('title', '');
    actions.changeItem(itemId, 'title', '', 'Lorem Ipsum');

    const store = actions.getStore();

    expect(store.hasItem(itemId)).equals(true);
    expect(store.getItem(itemId).getField('title')).equals('Lorem Ipsum');
  });
});

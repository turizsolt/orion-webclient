import { LocalStore } from '../../Local/LocalStore';

describe('LocalStore', () => {
  it('create', () => {
    const localStore = new LocalStore();
    localStore.change({
      id: '12345',
      fieldName: 'title',
      oldValue: undefined,
      newValue: 'Lorem'
    });
    expect(localStore.get('12345').getField('title')).toEqual('Lorem');
  });

  it('update', () => {
    const localStore = new LocalStore();
    localStore.change({
      id: '12345',
      fieldName: 'title',
      oldValue: 'Lorem',
      newValue: 'Ipsum'
    });
    expect(localStore.get('12345').getField('title')).toEqual('Ipsum');
  });
});

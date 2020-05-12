import { socket } from '../socket';
import { Store } from './Store';
import {
  ChangeItem,
  ServerGetItem,
  RelationChange
} from '../model/Change/Change';

export const initServerSocket = (store: Store) => {
  socket.on('changeItemAccepted', (data: ChangeItem) => {
    store.changeItemAccepted(data);
  });

  socket.on('changeItemHappened', (data: ChangeItem) => {
    store.changeItemHappened(data);
  });

  socket.on('changeItemConflicted', (data: ChangeItem) => {
    store.changeItemConflicted(data);
  });

  socket.on('allItem', (data: ServerGetItem[]) => {
    store.allItem(data);
  });

  socket.on('addRelationAccepted', (data: RelationChange) => {
    store.addRelationAccepted(data.oneSideId, data.relation, data.otherSideId);
  });

  socket.on('addRelationAlreadyExists', (data: RelationChange) => {
    store.addRelationAccepted(data.oneSideId, data.relation, data.otherSideId);
  });

  socket.on('addRelationHappened', (data: RelationChange) => {
    store.addRelationHappened(data.oneSideId, data.relation, data.otherSideId);
  });

  socket.on('removeRelationAccepted', (data: RelationChange) => {
    store.removeRelationAccepted(
      data.oneSideId,
      data.relation,
      data.otherSideId
    );
  });

  socket.on('removeRelationAlreadyExists', (data: RelationChange) => {
    store.removeRelationAccepted(
      data.oneSideId,
      data.relation,
      data.otherSideId
    );
  });

  socket.on('removeRelationHappened', (data: RelationChange) => {
    store.removeRelationHappened(
      data.oneSideId,
      data.relation,
      data.otherSideId
    );
  });
};

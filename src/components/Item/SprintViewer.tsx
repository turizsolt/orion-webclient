import React from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemId } from '../../model/Item/ItemId';
import { RootState } from '../../ReduxStore';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { getState } from '../../ReduxStore/commons';

export const SprintViewer: React.FC = () => {
  const { id: sprintId } = useParams();
  const { items, itemList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const sprintItemIds = itemList.filter(
    (itemId: ItemId) =>
      items[itemId].hashtags.findIndex(
        (x: HashtagInfo) => x.id === sprintId
      ) !== -1
  );

  const columns = ['todo', 'doing', 'done'];

  return (
    <div>
      <div>Sprint {sprintId}</div>
      <div style={{ display: 'flex', width: '100%' }}>
        {columns.map((column: string) => (
          <div style={{ width: '33.33%', padding: '0 10px 0 10px' }}>
            <div>{column}</div>
            <div>
              {sprintItemIds
                .filter((id: ItemId) => getState(id, items) === column)
                .map(id => (
                  <ItemViewer
                    key={id}
                    item={items[id]}
                    parentId={null}
                    path={''}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  //   return (
  //     <div>
  //       {id && (
  //         <>
  //           <Link to="/">to Root</Link>
  //           {items[id].parents.length > 0 && (
  //             <Link to={`/${items[id].parents[0]}`}>to Parent</Link>
  //           )}
  //           <ItemViewer item={items[id]} parentId={null} path={''} />
  //         </>
  //       )}
  //     </div>
  //   );
};

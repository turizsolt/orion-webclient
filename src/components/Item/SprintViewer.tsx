import React from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ItemId } from '../../model/Item/ItemId';
import { RootState } from '../../ReduxStore';
import { HashtagInfo } from '../../model/Item/ViewItem';
import { getState } from '../../ReduxStore/commons';
import { style, media } from 'typestyle';

const TableStyle = style(
  { display: 'flex', width: '100%' },
  media({ minWidth: 0, maxWidth: 899 }, { flexWrap: 'wrap' })
);
const ColumnStyle = style(
  media({ minWidth: 0, maxWidth: 899 }, { width: '100%' }),
  media({ minWidth: 900 }, { width: '33.33%' }),
  { padding: '0 10px 0 10px' }
);

export const SprintViewer: React.FC = () => {
  const { id: sprintId } = useParams<{id:ItemId}>();
  const { items, itemList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const sprintItemIds = itemList.filter(
    (itemId: ItemId) =>
      items[itemId] &&
      items[itemId].hashtags.findIndex(
        (x: HashtagInfo) => x.id === sprintId
      ) !== -1
  );

  const columns = ['todo', 'doing', 'done'];

  return (
    <div>
      <div>Sprint {sprintId}</div>
      <div className={TableStyle}>
        {columns.map((column: string) => (
          <div key={column} className={ColumnStyle}>
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
                    panelId={0}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

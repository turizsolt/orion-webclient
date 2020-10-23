import React, { useCallback, useState } from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { ItemId } from '../../model/Item/ItemId';
import { useSelector } from 'react-redux';
import { ItemAdderViewer } from './ItemAdderViewer';
import { style, media } from 'typestyle';
import { OptionsViewer } from './OptionsViewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const containerStyle = style(
  media(
    { minWidth: 0, maxWidth: 899 },
    {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  ),
  media(
    { minWidth: 900 },
    { display: 'flex', flexDirection: 'row-reverse', width: '100%' }
  )
);

const mainStyle = style({ flexGrow: 1 });

const buttonStyle = style({
  backgroundColor: 'var(--accent-color)',
  border: 'none',
  color: 'var(--dark-color)',
  padding: '15px',
  borderRadius: '20px',
});

export const RootItemViewer: React.FC = () => {
  const { items, viewedItemList } = useSelector(
    (state: any) => state.appReducer
  );

  const [showChildrenAdder, setShowChildrenAdder] = useState(false);

  const handleNew = useCallback(() => {
    setShowChildrenAdder(true);
  }, []);

  const handleNewClose = useCallback(() => {
    setShowChildrenAdder(false);
  }, []);


  return (
    <div className={containerStyle}>
      <OptionsViewer />
      <div className={mainStyle}>
        {viewedItemList.map((id: ItemId) => (
          <ItemViewer key={id} item={items[id]} parentId={null} path={''} />
        ))}
        {showChildrenAdder && (
          <ItemAdderViewer parentId={undefined} onClose={handleNewClose} />
        )}
        <button onClick={handleNew} className={buttonStyle}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </div>
  );
};

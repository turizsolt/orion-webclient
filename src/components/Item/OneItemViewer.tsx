import React from 'react';
import { ItemViewer } from './ItemViewer/ItemViewer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from '../../ReduxStore';

export const OneItemViewer: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const { items } = useSelector((state: RootState) => state.appReducer);

  return (
    <div>
      {id && (
        <>
          <Link to="/">to Root</Link>
          {items[id].parents.length > 0 && (
            <Link to={`/${items[id].parents[0]}`}>to Parent</Link>
          )}
          <ItemViewer item={items[id]} parentId={null} path={''} panelId={0} />
        </>
      )}
    </div>
  );
};

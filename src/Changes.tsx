import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeId } from './model/Change/ChangeId';
import { Change } from './model/Change/Change';

export const OneChange: React.FC<{ changeId: ChangeId }> = props => {
  const { changes } = useSelector((state: any) => state.appReducer);
  const change: Change = changes[props.changeId];
  return (
    <div>
      {change.changeId.substr(0, 6)}
      {change.response.substr(0, 1).toUpperCase()}
      {change.type === 'ItemChange' && (
        <>
          {change.itemId.substr(0, 6)}#{change.field}:{change.oldValue} >>{' '}
          {change.newValue}
        </>
      )}
      {change.type !== 'ItemChange' && (
        <>
          {change.type === 'AddRelation' ? '+' : '-'}{' '}
          {change.oneSideId.substr(0, 6)} {change.relation}{' '}
          {change.otherSideId.substr(0, 6)}
        </>
      )}
    </div>
  );
};

export const Changes: React.FC = () => {
  const { changeList } = useSelector((state: any) => state.appReducer);

  return (
    <div>
      <div>Changes:</div>
      {changeList.map((changeId: ChangeId) => (
        <OneChange changeId={changeId} />
      ))}
    </div>
  );
};

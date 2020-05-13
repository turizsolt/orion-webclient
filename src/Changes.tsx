import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeId } from './model/Change/ChangeId';
import { ItemChange } from './model/Change/Change';

export const Change: React.FC<{ changeId: ChangeId }> = props => {
  const { changes } = useSelector((state: any) => state.appReducer);
  const change: ItemChange = changes[props.changeId];
  return (
    <div>
      {change.changeId.substr(0, 6)}
      {change.response.substr(0, 1).toUpperCase()}
      {change.itemId.substr(0, 6)}#{change.field}:{change.oldValue} >>{' '}
      {change.newValue}
    </div>
  );
};

export const Changes: React.FC = () => {
  const { changeList } = useSelector((state: any) => state.appReducer);

  return (
    <div>
      <div>Changes:</div>
      {changeList.map((changeId: ChangeId) => (
        <Change changeId={changeId} />
      ))}
    </div>
  );
};

import React, {
    useCallback,
    useContext,
    ChangeEvent
  } from 'react';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../../ReduxStore';
  import { Actions } from '../../../LocalStore/Actions';
  import { ActionsContext } from '../../../App';
  import { fieldTypeList } from '../../../model/Item/FieldTypeOf';

  export const Order: React.FC = () => {
    const { order } = useSelector(
      (state: RootState) => state.appReducer
    );
  
    const actions: Actions = useContext(ActionsContext);
  
    const handleOrder = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        actions.order({ attribute: event.currentTarget.value });
      },
      [actions]
    );
  
    const handleOrderAsc = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        actions.order({ asc: event.currentTarget.value === 'asc' });
      },
      [actions]
    );
  
    return (
      <>
        <div>Order</div>
        <div>
          {/* duplicate code - field selector */}
          <select value={order.attribute} onChange={handleOrder}>
            {fieldTypeList.map(fieldType => (
              <option value={fieldType.name} key={fieldType.name}>
                {fieldType.name} ({fieldType.type})
              </option>
            ))}
          </select>
          <select value={order.asc ? 'asc' : 'desc'} onChange={handleOrderAsc}>
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>
      </>
    );
  };
  
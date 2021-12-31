import React, {
  useCallback,
  useContext,
  useState,
  KeyboardEvent,
  ChangeEvent
} from 'react';
import { useSelector } from 'react-redux';
import { style } from 'typestyle';
import { RootState } from '../../ReduxStore';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';
import { fieldTypeList } from '../../model/Item/FieldTypeOf';

const sideStyle = style({
  minWidth: '160px',
  minHeight: '50px',
  backgroundColor: '#bcd2d3',
  marginLeft: '10px',
  marginBottom: '10px'
});

export interface OptionViewerProps {
    panelId: number;
}

export const OptionsViewer: React.FC<OptionViewerProps> = (props) => {
  const { panelList } = useSelector(
    (state: RootState) => state.appReducer
  );

  const { panelId } = props;

  const { options } = panelList[panelId];
  const { filters, search, order } = options;

  const actions: Actions = useContext(ActionsContext);

  const [saveName, setSaveName] = useState('');

  const handleToggleFilter = useCallback(
    (filterId: string) => () => {
      actions.toggleFilter(panelId, filterId);
    },
    [panelId, actions]
  );

  const handleSearch = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const searchString = event.currentTarget.value;
      actions.search(panelId, searchString);
    },
    [panelId, actions]
  );

  const handleOrder = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      actions.order(panelId, { attribute: event.currentTarget.value });
    },
    [panelId, actions]
  );

  const handleOrderAsc = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      actions.order(panelId, { asc: event.currentTarget.value === 'asc' });
    },
    [panelId, actions]
  );

  const handleSaveName = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.which === 13) {
            const name = event.currentTarget.value;
            actions.savePanels(name, panelList.map(x => x.options));
            setSaveName('');
        }
    },
    [panelList, actions]
  );

  const handleSaveNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
        setSaveName(event.currentTarget.value);
    },
    []
  );

  const handleSaveOptions = useCallback(() => {
      actions.savePanels(saveName, panelList.map(x => x.options));
      setSaveName('');
    },
    [saveName, panelList, actions]
  );

  return (
    <div className={sideStyle}>
      <button onClick={() => localStorage.clear()}>Clear localstorage</button>
      <div>Search</div>
      <div>
        <input type="text" defaultValue={search} onKeyUp={handleSearch} />
      </div>
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
      <div>Filters</div>
      <div>
        {filters.map(filter => (
          <div key={filter.id}>
            {!filter.hashtag && <>
              <input
                type="checkbox"
                checked={filter.on}
                onChange={handleToggleFilter(filter.id)}
              />
              {filter.name}
            </>}
          </div>
        ))}
      </div>
      <div>
        <input type="text" value={saveName} onChange={handleSaveNameChange} onKeyUp={handleSaveName} />
      </div>
      <button onClick={handleSaveOptions}>Save options</button>
    </div>
  );
};

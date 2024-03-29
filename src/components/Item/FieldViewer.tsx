import React, { useContext, useCallback } from 'react';
import { ItemId } from '../../model/Item/ItemId';
import { StringFieldViewer } from './EditableFieldViewer/StringFieldViewer';
import { TextFieldViewer } from './EditableFieldViewer/TextFieldViewer';
import { Actions } from '../../LocalStore/Actions';
import { ActionsContext } from '../../App';
import { BooleanFieldViewer } from './BooleanFieldViewer';
import { EnumFieldViewer } from './EnumFieldViewer';
import { NumberFieldViewer } from './EditableFieldViewer/NumberFieldViewer';
import { DateFieldViewer } from './EditableFieldViewer/DateFieldViewer';
import { ColorFieldViewer } from './EditableFieldViewer/ColorFieldViewer';
import { style } from 'typestyle';
import { StateDot } from './StateDot';
import { Updateness } from '../../model/Updateness';

interface Props {
    id: ItemId;
    value: any;
    type: string;
    name: string;
    params?: any;
    updateness: Updateness;
}

export interface FieldProps extends Props {
    onChange: (value: any) => void;
}

const inner = {
    fontSize: '16px',
    alignItems: 'center',
    width: '90%'
};

const fieldStyle = style({
    display: 'flex',
    minHeight: '1.5em',
    fontSize: '16px',
    padding: '5px 0 5px 0',
    alignItems: 'center',
    flexGrow: 1,
    $nest: {
        '& div.outerInput': { flexGrow: 1 },
        "& input:not([type='checkbox'])": inner,
        '& select': inner,
        '& textarea': { ...inner, height: '60px' }
    }
});

const labelStyle = style({
    width: '80px'
});

export const FieldViewer: React.FC<Props> = props => {
    const { type, id, name, params, value: oldValue, updateness } = props;

    const actions: Actions = useContext(ActionsContext);

    const handleChange = useCallback(
        (newValue: any) => {
            actions.changeItem(id, name, oldValue, newValue);
        },
        [actions, id, name, oldValue]
    );

    const handleRemoveField = useCallback(() => {
        actions.changeItem(id, name, oldValue, undefined);
    }, [actions, id, name, oldValue]);

    const fieldProps = { ...props, onChange: handleChange };
    const noLabel = params && params.noLabel;

    return (
        <div className={fieldStyle}>
            {!noLabel && <StateDot symbol={updateness} />}
            {!noLabel && <div className={labelStyle}>{name}</div>}
            {type === 'Enum' && <EnumFieldViewer {...fieldProps} />}
            {type === 'Boolean' && <BooleanFieldViewer {...fieldProps} />}
            {type === 'Color' && <ColorFieldViewer {...fieldProps} />}
            {type === 'Date' && <DateFieldViewer {...fieldProps} />}
            {type === 'Number' && <NumberFieldViewer {...fieldProps} />}
            {type === 'String' && <StringFieldViewer {...fieldProps} />}
            {type === 'Text' && <TextFieldViewer {...fieldProps} />}
            {type === 'Generator' && <TextFieldViewer {...fieldProps} />}
            {!noLabel && <button onClick={handleRemoveField}>x</button>}
        </div>
    );
};

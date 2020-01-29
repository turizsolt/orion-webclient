import {px} from "csx";
import React, {FC, useCallback, useContext} from "react";
import {style} from "typestyle";
import {ProjectContext} from "../App";
import {generateHash} from "../utils/generateHash";

const container = style({
    color: 'black',
    display: 'flex',
});

const addSign = style({
    width: px(15),
    paddingLeft: px(4),
});

const inputField = style({
    backgroundColor: "inherit",
    height: px(10),
    border: 0,
    borderBottom: '1px solid black'
});

interface Props {
    parentId: string;
}

export const ItemAdder: FC<Props> = props => {
    const { parentId } = props;
    const { dispatch } = useContext(ProjectContext);

    const handleEnter = useCallback(
        (e) => {
            if (e.which === 13 && e.target.value !== '') {
                dispatch({type: 'ADD_ITEM', payload: {parentId, item: {id: generateHash(), name: e.target.value, status: 'todo'}}});
                e.target.value = '';
            }
        },
        [dispatch, parentId]
    );

    return <div className={container}>
        <div className={addSign}>+</div>
        <div>
            <input type="text" className={inputField} onKeyUp={handleEnter} />
        </div>
    </div>;
};

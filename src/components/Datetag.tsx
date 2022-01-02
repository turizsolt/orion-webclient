import React from 'react';
import { getContrastColor } from '../ReduxStore/commons';
import {
    hashtagStyle,
    hashtagWidthStyle,
} from './Item/ItemViewer/ItemViewer.style';

interface Props {
    date: Date;
}

export const Datetag: React.FC<Props> = (props) => {
    const { date } = props;

    const color = '#edd972';

    const start: Date = (new Date());
    start.setHours(0, 0, 0, 0);

    const end: Date = (new Date());
    end.setHours(23, 59, 59, 999);

    const print = (date: Date): string => {
        const realDate = new Date(date);
        if (start <= realDate && realDate <= end) return "Today";
        return (realDate).toISOString().substring(5, 10);
    }

    const printedDate = print(date);

    return (
        <span
            className={hashtagStyle}
            style={{
                color: getContrastColor(color),
                backgroundColor: color
            }}
            key={printedDate}
        >
            <span className={hashtagWidthStyle}>{printedDate}</span>
        </span>
    );
};

import React, { ChangeEvent, useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionsContext } from '../../App';
import { Actions } from '../../LocalStore/Actions';
import { RootState } from '../../ReduxStore';
import { Panel } from '../../ReduxStore/reducer';
import { getDefaultPanel } from '../../ReduxStore/reducerInitialState';

interface Props { }

export const CalendarGenerator: React.FC<Props> = (props) => {
    const actions: Actions = useContext(ActionsContext);

    const [date, setDate] = useState((new Date()));

    const { panel } = useSelector(
        (state: RootState) => state.appReducer
    );

    const handleCalendarGenerator = useCallback(() => {
        const newPanelList: Panel[] = [];

        const today = new Date();
        today.setHours(12);
        date.setHours(12);

        const diff: number = date.getTime() - today.getTime();
        const shift: number = Math.round(diff / (1000 * 3600 * 24));

        newPanelList.push(getDefaultPanel({
            id: 'days-before',
            name: 'Days before',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: -1000 + shift,
                endDay: -1 + shift,
            },
            on: true
        }));

        newPanelList.push(getDefaultPanel({
            id: 'days-today',
            name: 'Today',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: 0 + shift,
                endDay: 0 + shift,
            },
            on: true
        }));

        newPanelList.push(getDefaultPanel({
            id: 'days-tomorrow',
            name: 'Tomorrow',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: 1 + shift,
                endDay: 1 + shift,
            },
            on: true
        }));

        newPanelList.push(getDefaultPanel({
            id: 'days-the-day-after-tomorrow',
            name: 'The day after tomorrow',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: 2 + shift,
                endDay: 2 + shift,
            },
            on: true
        }));

        newPanelList.push(getDefaultPanel({
            id: 'days-the-day-after-after-tomorrow',
            name: 'The day after after tomorrow',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: 3 + shift,
                endDay: 3 + shift,
            },
            on: true
        }));

        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        lastDayOfMonth.setHours(12);
        const computedEndDayDiff: number = lastDayOfMonth.getDate() - today.getDate();

        newPanelList.push(getDefaultPanel({
            id: 'days-the-days-after-in-month',
            name: 'The days after in month',
            f: () => () => false,
            rule: {
                name: 'days',
                startDay: 4 + shift,
                endDay: computedEndDayDiff,
            },
            on: true
        }));

        for (let i = 6; i < 10; i++) {
            newPanelList.push(i < panel.list.length ? panel.list[i] : getDefaultPanel({
                id: 'no-due',
                name: 'Has no due',
                f: () => () => false,
                rule: { name: 'isNotGiven', field: 'due' },
                on: true
            }));
        }

        newPanelList[0].options.disableAdding = true;
        newPanelList[5].options.disableAdding = true;

        actions.setPanels(newPanelList);
    }, [actions, date, panel.list]);

    const handleDateChange = useCallback((event: ChangeEvent) => {
        setDate(new Date((event as any).target.value));
    }, []);

    return (
        <div>
            Calendar view, T:
            <input type='date' value={date.toISOString().substring(0, 10)} onChange={handleDateChange} />
            <button onClick={handleCalendarGenerator}>Generate</button>
        </div>
    );
};

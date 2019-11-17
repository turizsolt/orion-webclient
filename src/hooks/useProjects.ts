import { Reducer, useReducer } from 'react';
import { AnyAction } from 'redux';
import {Item, Project} from "../interfaces";

interface State {
    projects: Project[];
}

const initState:State = {
    projects: [
        {
            id: 'ALL',
            name: 'Everything',
            items: [],
        },
    ],
};

const reducer: Reducer<State, AnyAction> = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {projects: [addItem(state.projects[0], action.payload.parentId, action.payload.item)]};

        case 'ADD_CHILDREN':
            return {projects: [addChildren(state.projects[0], action.payload.id)]};

        default:
            return state;
    }
};

export const useProjects = (init = initState) => {
    return useReducer(reducer, init);
};

const addChildren = (data: Project | Item, id:string):any => {
    if(data.id === id) {
        return {...data, items: []};
    } else {
        if(data.items) {
            return {...data, items: data.items.map((item) => addChildren(item, id))};
        } else {
            return data;
        }
    }
};

const addItem = (data: Project | Item, id:string, newItem:Item):any => {
    if(data.id === id) {
        return {...data, items: [...data.items || [], newItem]};
    } else {
        if(data.items) {
            return {...data, items: data.items.map((item) => addItem(item, id, newItem))};
        } else {
            return data;
        }
    }
};


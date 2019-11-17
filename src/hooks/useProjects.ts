import { Reducer, useReducer } from 'react';
import { AnyAction } from 'redux';
import {Item, Project} from "../interfaces";

interface State {
    projects: Project[];
}

const loadProjects = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || "[]");
    if(projects && projects.length > 0) return projects;

    return [
        {
            id: 'ALL',
            name: 'Everything',
            items: [],
        },
    ];
};

const initState:State = {
    projects: loadProjects(),
};

const reducer: Reducer<State, AnyAction> = (state, action) => {
    let projects = state.projects;

    switch (action.type) {
        case 'ADD_ITEM':
            projects = projects.map(proj => addItem(proj, action.payload.parentId, action.payload.item));
            break;

        case 'ADD_CHILDREN':
            projects = projects.map(proj => addChildren(proj, action.payload.id));
            break;

        case 'SET_STATE':
            projects = projects.map(proj => setState(proj, action.payload.id, action.payload.state));
            break;

        case 'EDIT_NAME':
            projects = projects.map(proj => editName(proj, action.payload.id, action.payload.name));
            break;

        case 'DELETE':
            projects = deleteFrom(projects, action.payload.id);
            break;
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    return {projects};
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

const setState = (data: Project | Item, id:string, state: string):any => {
    if(data.id === id) {
        return {...data, state};
    } else {
        if(data.items) {
            return {...data, items: data.items.map((item) => setState(item, id, state))};
        } else {
            return data;
        }
    }
};

const editName = (data: Project | Item, id:string, name: string):any => {
    if(data.id === id) {
        return {...data, name};
    } else {
        if(data.items) {
            return {...data, items: data.items.map((item) => editName(item, id, name))};
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

const deleteFrom = (dataList: (Project | Item)[], id:string):any => {
    if (dataList.findIndex(x => x.id === id) !== -1) {
        return dataList.filter(x => x.id !== id);
    } else {
        return dataList.map(data => {
            if (data.items) {
                return {...data, items: deleteFrom(data.items, id)};
            } else {
                return data;
            }
        });
    }
};

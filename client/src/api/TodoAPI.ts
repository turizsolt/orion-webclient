import axios from 'axios';
import {Todo} from "../store/model";

export class TodoAPI {
    static add = async (todo: any) => {
        const response = await axios.request({
            method: 'POST',
            url: 'http://localhost:3000/todo',
            data: todo,
        });

        return response.data as Todo;
    };

    static get = async (id: string) => {
        const response = await axios.request({
            method: 'GET',
            url: 'http://localhost:3000/todo/'+id,
        });

        return response.data as Todo;
    };

    static list = async () => {
        const response = await axios.request({
            method: 'GET',
            url: 'http://localhost:3000/todo/',
        });

        return response.data as Todo[];
    };

    static done = async (id: string) => {
        const response = await axios.request({
            method: 'PUT',
            url: 'http://localhost:3000/todo/',
            data: {
                id,
                doneAt: new Date(),
            }
        });

        return response.data as Todo;
    };

}

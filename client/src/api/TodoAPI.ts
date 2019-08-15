import axios from 'axios';
import {Todo} from "../store/model";

const port = 8128;
const baseUrl = `http://localhost:${port}`;

export class TodoAPI {
    static add = async (todo: any) => {
        const response = await axios.request({
            method: 'POST',
            url: `${baseUrl}/todo`,
            data: todo,
        });

        return response.data as Todo;
    };

    static get = async (id: string) => {
        const response = await axios.request({
            method: 'GET',
            url: `${baseUrl}/todo/${id}`,
        });

        return response.data as Todo;
    };

    static list = async () => {
        const response = await axios.request({
            method: 'GET',
            url: `${baseUrl}/todo`,
        });

        return response.data as Todo[];
    };

    static done = async (id: string) => {
        const response = await axios.request({
            method: 'PUT',
            url: `${baseUrl}/todo`,
            data: {
                id,
                doneAt: new Date(),
            }
        });

        return response.data as Todo;
    };

    static addEpic = async (params: {id: string, epic: string}) => {
        const response = await axios.request({
            method: 'PUT',
            url: `${baseUrl}/todo/addEpic`,
            data: params,
        });

        return response.data as Todo;
    };

}

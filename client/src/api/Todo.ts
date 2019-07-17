import axios from 'axios';

export class Todo {
    static add = async (todo: any) => {
        const response = await axios.request({
            method: 'POST',
            url: 'http://localhost:3000/todo',
            data: todo,
        });

        return JSON.stringify(response.data);
    };
}

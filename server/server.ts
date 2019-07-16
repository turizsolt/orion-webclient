import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

interface Todo {
    id: string;
    epic: string;
    title: string;
    order: number;
    description: string;
    createdAt: Date;
    doneAt: Date;
}

const todos:Todo[] = [];

app.post('/todo', (req, res) => {
    const todo:Todo = req.body as Todo;
    todos.push(todo);
    res.send(todo);
});

app.get('/todo', (req, res) => {
    res.send(todos);
});

app.put('/todo', (req, res) => {
    const todoIndex = todos.findIndex(x => x.id == req.body.id);
    if (todoIndex !== -1) {
        const todo = todos[todoIndex];
        const newTodo = {...todo, ...req.body};
        todos[todoIndex] = newTodo;
        res.send(newTodo);
    } else {
        res.send([]);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
const app = express();
const port = 8128;

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

let todos:Todo[] = [];

function save() {
    fs.writeFileSync('todos', JSON.stringify(todos));
}

function load() {
    if(fs.existsSync('todos')) {
        todos = JSON.parse(fs.readFileSync('todos', 'utf8'));
    }
}

load();

app.post('/todo', (req, res) => {
    const todo:Todo = req.body as Todo;
    todo.id = Math.floor(Math.random()*9000000+1000000).toString();
    todos.push(todo);
    res.send(todo);
    save();
});

app.get('/todo', (req, res) => {
    res.send(todos);
});

app.get('/todo/:id', (req, res) => {
    res.send(todos.find(x => x.id == req.params.id));
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
    save();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

import * as express from 'express';
import * as fs from "fs";

export const todoRouter = express.Router();

interface Todo {
    id: string;
    epic: string;
    title: string;
    order: number;
    description: string;
    createdAt: Date;
    doneAt: Date;
}

export let todos:Todo[] = [];

function save() {
    fs.writeFileSync('todos', JSON.stringify(todos));
}

function load() {
    if(fs.existsSync('todos')) {
        todos = JSON.parse(fs.readFileSync('todos', 'utf8'));
    }
}

load();

todoRouter.post('/todo', (req, res) => {
    const todo:Todo = req.body as Todo;
    todo.id = Math.floor(Math.random()*9000000+1000000).toString();
    todos.push(todo);
    res.send(todo);
    save();
});

todoRouter.get('/todo', (req, res) => {
    res.send(todos);
});

todoRouter.get('/todo/:id', (req, res) => {
    res.send(todos.find(x => x.id == req.params.id));
});

todoRouter.put('/todo', (req, res) => {
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

todoRouter.put('/todo/addEpic', (req, res) => {
    const todoIndex = todos.findIndex(x => x.id == req.body.id);
    if (todoIndex !== -1) {
        const todo = todos[todoIndex];
        const newTodo = {...todo, epic: req.body.epic};
        todos[todoIndex] = newTodo;
        res.send(newTodo);
    } else {
        res.send([]);
    }
    save();
});

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import {todoRouter} from "./src/Todo";
import {epicRouter} from "./src/Epic";
const app = express();
const port = 8128;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.use(todoRouter);
app.use(epicRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

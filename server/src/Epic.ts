import * as express from 'express';
import * as fs from "fs";

export const epicRouter = express.Router();

interface Epic {
    tag: string;
    name: string;
}

export let epics:Epic[] = [];

function save() {
    fs.writeFileSync('epics', JSON.stringify(epics));
}

function load() {
    if(fs.existsSync('epics')) {
        epics = JSON.parse(fs.readFileSync('epics', 'utf8'));
    }
}

load();

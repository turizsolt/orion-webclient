import {Item} from "./Item";

export interface Project {
    id: string;
    name: string;
    items: Item[];
}

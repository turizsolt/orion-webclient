export interface Item {
    id: string;
    name: string;
    state: string;
    items?: Item[];
}

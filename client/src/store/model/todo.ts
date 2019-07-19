export interface Todo {
    id: string;
    epic: string;
    title: string;
    order: number;
    description: string;
    createdAt: Date;
    doneAt: Date;
}

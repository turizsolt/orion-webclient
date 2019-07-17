import {Todo} from "../../api/Todo";

export class CommandInterpreter {
    static interpret = (command:string) => {
        console.log('command: ', command);

        const addRegex = /add (.*)/;
        const match = command.match(addRegex);
        if (match) {
            Todo.add({
                title: match ? match[1].toString() : '',
                createdAt: new Date(),
            });
        } else {
            console.log('no matches');
        }
    };
}

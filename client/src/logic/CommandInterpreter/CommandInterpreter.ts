import {TodoAPI} from "../../api/TodoAPI";
import {getTodo, listTodo, setCommand, Todo} from "../../store";

export class CommandInterpreter {
    static interpret = async (command:string) => {
        console.log('command: ', command);

        const xRegex = /add #([^ ]*) (.*)/;
        const xMatch = command.match(xRegex);
        if (xMatch) {
            const response = await TodoAPI.add({
                epic: xMatch ? xMatch[1].toString() : '',
                title: xMatch ? xMatch[2].toString() : '',
                createdAt: new Date(),
            });
            return () => getTodo({ todo: response });
        }

        const yRegex = /add (.*) #([^ ]*)/;
        const yMatch = command.match(yRegex);
        if (yMatch) {
            const response = await TodoAPI.add({
                epic: yMatch ? yMatch[2].toString() : '',
                title: yMatch ? yMatch[1].toString() : '',
                createdAt: new Date(),
            });
            return () => getTodo({ todo: response });
        }

        const addRegex = /add (.*)/;
        const addMatch = command.match(addRegex);
        if (addMatch) {
            const response = await TodoAPI.add({
                title: addMatch ? addMatch[1].toString() : '',
                createdAt: new Date(),
            });
            return () => getTodo({ todo: response });
        }

        const getRegex = /get #(.*)/;
        const getMatch = command.match(getRegex);
        if (getMatch) {
            const response = await TodoAPI.get(getMatch[1].toString());
            return () => getTodo({ todo: response });
        }

        const doneRegex = /done #(.*)/;
        const doneMatch = command.match(doneRegex);
        if (doneMatch) {
            const response = await TodoAPI.done(doneMatch[1].toString());
            return () => getTodo({ todo: response });
        }

        const listRegex = /list/;
        const listMatch = command.match(listRegex);
        if (listMatch) {
            const response = await TodoAPI.list();
            return () => listTodo({ todos: response });
        }

        const addEpicRegex = /ae #(.*) #(.*)/;
        const addEpicMatch = command.match(addEpicRegex);
        if (addEpicMatch) {
            const response = await TodoAPI.addEpic({id: addEpicMatch[1].toString(), epic: addEpicMatch[2].toString()});
            return () => getTodo({ todo: response });
        }

        console.log('no matches');
        return false;

    };
}

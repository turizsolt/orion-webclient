import {TodoAPI} from "../../api/TodoAPI";
import {getTodo, listTodo, setCommand, Todo} from "../../store";

export class CommandInterpreter {
    static interpret = async (command:string) => {
        console.log('command: ', command);

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

        console.log('no matches');
        return false;

    };
}

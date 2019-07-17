export class CommandInterpreter {
    static interpret = (command:string) => {
        console.log('command: ', command);

        const addRegex = /add (.*)/;
        const match = command.match(addRegex);
        if (match) {
            console.log(match);
        } else {
            console.log('no matches');
        }
    };
}

export function createConversationPrompt() {
    let name = "";
    let users = [""];

    while (name === "") {
        name = prompt("Enter conversation name:");
    }
    while (users[0] === "") {
        const input = prompt("Enter emails of users (comma separated):");
        if (input === null) {
            users = null;
            break;
        }
        users = input.split(",");
    }

    return [name, users];
}
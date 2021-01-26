import addMessage from "../scripts/addMessage";

const helpMessage = (commandString, Chat) => {
    addMessage(Chat,
        {
            author: "System",
            message: "list all the commands : ",
            separator: " : "
        })

}

export default helpMessage;

import AuthService from "../services/auth.service";

const privateMessage = (commandString, Chat, socket) => {
    var nickToSend = commandString.substr(0, commandString.indexOf(' '));
    var messageToSend = commandString.substr(commandString.indexOf(' ') + 1);

    if (messageToSend === "" || messageToSend === null || nickToSend === "" || nickToSend === null) {
        Chat.setState({ error: "You have to specify a name and a message to send  : \"/msg nickname message to send\"" });

    } else {
        // SEND MESSAGE
        socket.emit('SEND_PRIVATE_MESSAGE', {
            author: AuthService.getCurrentUser().username,
            message: messageToSend,
            separator: " (private) : ",
            receiver: nickToSend
        })
    }
}

export default privateMessage;

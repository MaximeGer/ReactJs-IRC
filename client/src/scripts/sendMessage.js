
import privateMessage from "../commands/privateMessage"
import changeNick from "../commands/changeNick"
import createChannel from "../commands/createChannel"
import joinChannel from "../commands/joinChannel"
import deleteChannel from "../commands/deleteChannel"
import quitChannel from "../commands/quitChannel"
import showUsers from "../commands/showUsers"
import listChannels from "../commands/listChannels"
import helpMessage from "../commands/helpMessage"

import AuthService from "../services/auth.service";
import axios from "axios"
import authService from "../services/auth.service"


const sendMessage = (Chat, socket) => {
    var title = Chat.state.title;
    var message = Chat.state.message;
    var commandString = "";

    Chat.setState({ error: "" });
    Chat.setState({ success: "" });

    switch (true) {
        case new RegExp("^/users(?![^ ])").test(message):
            showUsers(Chat.state.title, socket);
            break;

        case new RegExp("^/msg(?![^ ])").test(message):
            commandString = message.slice(5);
            privateMessage(commandString, Chat, socket, Chat.state.title);
            break;

        case new RegExp("^/nick(?![^ ])").test(message):
            commandString = message.slice(6);
            changeNick(commandString, Chat, socket);
            break;

        case new RegExp("^/list(?![^ ])").test(message):
            commandString = message.slice(6);
            listChannels(commandString, Chat)
            break;

        case new RegExp("^/join(?![^ ])").test(message):
            commandString = message.slice(6);
            joinChannel(commandString, Chat, socket);
            break;

        case new RegExp("^/quit(?![^ ])").test(message):
            commandString = message.slice(6);
            quitChannel(commandString, Chat, socket);
            break;

        case new RegExp("^/help(?![^ ])").test(message):
            commandString = message.slice(6);
            helpMessage(commandString, Chat);
            break;

        case new RegExp("^/create(?![^ ])").test(message):
            commandString = message.slice(8);
            createChannel(commandString, Chat);
            break;

        case new RegExp("^/delete(?![^ ])").test(message):
            commandString = message.slice(8);
            deleteChannel(commandString, Chat, socket);
            break;

        default:
            socket.emit('SEND_MESSAGE', {
                author: AuthService.getCurrentUser().username,
                message: message,
                separator: " : ",
                room: Chat.state.title
            })
            axios.post("http://localhost:9000/api/messages", { message: message , channelTitle : title, author : authService.getCurrentUser().username, authorId : authService.getCurrentUser().id, namechannel: title});
            break;
    }

    Chat.setState({ message: '' });

};

export default sendMessage;
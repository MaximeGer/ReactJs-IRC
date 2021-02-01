import AuthService from "../services/auth.service";

const quitChannel = (name, Chat, socket) => {
    if (name === "" || name === " " || name === null) {
        Chat.setState({ error: "You have to specify a name for the channel you want to quit : \"/quit newChannel\"" });
    } else if (!Chat.props.parent.state.channels.has(name)) {
        // If not part of Chat channel :
        Chat.setState({ error: "You are not part of Chat channel : " + name });
    } else {
        // QUIT CHANNEL
        
        socket.emit('SEND_MESSAGE', {
            author: "System",
            message: AuthService.getCurrentUser().username + " leaved the channel",
            separator: " : ",
            room: name
        })

        var roomId = Chat.props.parent.state.channels.get(name);

        socket.emit('QUIT_ROOM', {
            id: roomId,
            room: name
        })

        Chat.props.parent.state.channels.delete(name);
    }
}

export default quitChannel;
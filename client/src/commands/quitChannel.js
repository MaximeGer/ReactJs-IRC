const quitChannel = (name, Chat, socket) => {
    if (name === "" || name === " " || name === null) {
        Chat.setState({ error: "You have to specify a name for the channel you want to quit : \"/quit newChannel\"" });
    } else if (!Chat.state.channels.get(name)) {
        // If not part of Chat channel :
        Chat.setState({ error: "You are not part of Chat channel : " + name });
    } else {
        // QUIT CHANNEL
        console.log("Quit the channel with the name : " + name + " if it exist and you joined it");
        //Chat.state.channels.splice(name, 1);

        var idToDisconnect = Chat.state.channels.get(name);
        socket.emit('QUIT_ROOM', {
            id: idToDisconnect,
            room: name
        })

        Chat.state.channels.delete(name);
    }
}

export default quitChannel;
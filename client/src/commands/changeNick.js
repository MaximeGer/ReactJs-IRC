const changeNick = (name, Chat, socket) => {
    Chat.setState({ username: name });
    socket.emit('SET_NEW_USERNAME', {
        newUsername: name
    })
}

export default changeNick;

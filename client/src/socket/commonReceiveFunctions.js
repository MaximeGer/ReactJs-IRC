const commonReceiveFunctions = (socket, Chat) => {
    socket.on('RECEIVE_MESSAGE', function (data) {
        addMessage(data);
        var messageBody = document.querySelector('.messages');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });

    const addMessage = data => {
        Chat.setState({ messages: [...Chat.state.messages, data] });
    };

    socket.on('RECEIVE_USERS', function (data) {
        addMessage({
            author: "System",
            message: "list of all users on the channel : ",
            separator: " : "
        })
        data.listUsers.forEach(username => {
            addMessage({
                author: "",
                message: username,
                separator: " - "
            })
        })
    });
}

export default commonReceiveFunctions;
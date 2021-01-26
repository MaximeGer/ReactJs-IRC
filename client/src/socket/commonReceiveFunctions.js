import addMessage from "../scripts/addMessage";


const commonReceiveFunctions = (socket, Chat) => {
    socket.on('RECEIVE_MESSAGE', function (data) {
        addMessage(Chat, data);
        var messageBody = document.querySelector('.messages');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });


    socket.on('RECEIVE_USERS', function (data) {
        addMessage(Chat,
            {
                author: "System",
                message: "list of all users on the channel : ",
                separator: " : "
            })
        data.listUsers.forEach(username => {
            addMessage(Chat,
                {
                    author: "",
                    message: username,
                    separator: " - "
                })
        })
        var messageBody = document.querySelector('.messages');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });
}

export default commonReceiveFunctions;
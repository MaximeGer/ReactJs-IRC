const addMessage = (Chat, data) => {
    Chat.setState({ messages: [...Chat.state.messages, data] });
    
    var messageBody = document.querySelector('.messages');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
};

export default addMessage;

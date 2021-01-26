const addMessage = (Chat, data) => {
    Chat.setState({ messages: [...Chat.state.messages, data] });
};

export default addMessage;

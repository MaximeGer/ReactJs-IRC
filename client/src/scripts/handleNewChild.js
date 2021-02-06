const handleNewChild = (newId, nameChannel, Chat) => {
    const addIdToChannel = Chat.state.channels;
    addIdToChannel.set(nameChannel, newId)
    Chat.setState({ channels: addIdToChannel })
}


export default handleNewChild;
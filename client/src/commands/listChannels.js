const listChannels = async (name, Chat) => {
    const addMessage = data => {
        Chat.setState({ messages: [...Chat.state.messages, data] });
    };

    await fetch("http://localhost:9000/api/channels/regex?regex=" + name, {
        method: 'GET',
    }).then(response => {
        if (response.status === 200) {
            addMessage({
                author: "System",
                message: "list of all channels available : ",
                separator: " : "
            })
            response.json().then(data => {
                data.forEach(channel => {
                    addMessage({
                        author: "",
                        message: channel.name,
                        separator: " - "
                    })
                });
            })
        } else if (response.status === 404) {
            Chat.setState({ error: "No channel could be found with that name : \"" + name });
        } else {
            Chat.setState({ error: "There was an error when displaying the channels" });
        }
    }).catch(err => {
        Chat.setState({ error: "There was an error when displaying the channels" });
    });
}

export default listChannels;

const listChannels = (name, Chat) => {

    await fetch("http://localhost:9000/api/channels/regex/" + name, {
        method: 'GET',
    }).then(response => {
        if (response.status === 200) {
            Chat.setState({ success: "The channel \"" + name + "\" has been successfully joined" });
            channelExists = true;
            id = response.id;
        } else if (response.status === 404) {
            Chat.setState({ error: "The channel \"" + name + "\" couldn't be found" });
        } else {
            Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
        }
    }).catch(err => {
        Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
    });
}

export default listChannels;

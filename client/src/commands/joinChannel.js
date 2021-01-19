import ReactDOM from 'react-dom'


const joinChannel = async (name, Chat) => {
    var channelExists = false;
    var id;
    await fetch("http://localhost:9000/api/channels/byName/" + name, {
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

    if (name === "" || name === " " || name === null) {
        Chat.setState({ error: "You have to specify a name for the channel you want to join : \"/join newChannel\"" });
    } else if (!channelExists) {
        // If does not exist :
        Chat.setState({ error: "Chat channel does not exist : " + name });
    } else {
        // JOIN CHANNEL DB + SOCKET.IO
        console.log("Join the channel with the name : " + name);
        var div = document.createElement("div");
        div.className = "row"

        document.querySelector(".container").append(div)
        const nodes = document.querySelectorAll(".row")
        const last = nodes[nodes.length - 1];

        const element = Chat.renderChannel(name, id);

        ReactDOM.render(element, last)
        //Chat.setState({ elements: [...Chat.state.elements, element] });
        Chat.setState({ elements: [...Chat.state.elements, element] });

        var test = new Map(Chat.state.channels);
        test.set(name, "");

        // React.createElement(element, document.querySelector("body"))
        Chat.setState({ channels: test });
        console.log(Chat.state.channels);
    }
}
export default joinChannel;
import ReactDOM from 'react-dom'

const joinChannel = async (name, Chat, socket) => {
    if (!Chat.props.parent.state.channels.has(name)) {
        await fetch("http://localhost:9000/api/channels/byName/" + name, {
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                if (name === "" || name === " " || name === null) {
                    Chat.setState({ error: "You have to specify a name for the channel you want to join : \"/join newChannel\"" });
                } else {
                    // JOIN CHANNEL DB + SOCKET.IO

                    var div = document.createElement("div");
                    div.className = "col-4 mt-4"
                    div.id = name;
                    console.log("div :")
                    console.log(div)
                    document.querySelector("#channels .row").append(div)

                    var nodes = document.querySelectorAll("#channels .row .col-4")
                    var last = nodes[nodes.length - 1];
                    console.log("last :")
                    console.log(last)

                    const element = Chat.props.parent.renderChannel(name, response.id);

                    ReactDOM.render(element, div)

                    var allChannels = new Map(Chat.state.channels);
                    allChannels.set(name, "");

                    Chat.setState({ channels: allChannels });

                    Chat.setState({ success: "The channel \"" + name + "\" has been successfully joined" });
                }
            } else if (response.status === 404) {
                Chat.setState({ error: "The channel \"" + name + "\" couldn't be found" });
            } else {
                Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
            }
        }).catch(err => {
            Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
        });
    } else {
        Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined, you already have joined it" });

    }



}
export default joinChannel;

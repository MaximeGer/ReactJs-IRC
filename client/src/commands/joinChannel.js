import ReactDOM from 'react-dom'
import addMessage from "../scripts/addMessage"

import AuthService from "../services/auth.service";

const joinChannel = async (name, Chat, socket) => {
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
                div.id = 'Channel name : ' + name;
                document.querySelector("#channels .row").append(div)

                var nodes = document.querySelectorAll("#channels .row .col-4")
                var last = nodes[nodes.length - 1];

                const element = Chat.props.parent.renderChannel(name,  response.id);

                var channel = ReactDOM.render(element, last)

                addMessage(channel,
                    {
                        author: "System",
                        message: AuthService.getCurrentUser().username + " joined the channel",
                        separator: " : "
                    })

                var allChannels = new Map(Chat.state.channels);
                allChannels.set(name, "");

                Chat.setState({ channels: allChannels });

                socket.emit('SEND_MESSAGE', {
                    author: "System",
                    message: AuthService.getCurrentUser().username + " joined the channel",
                    separator: " : ",
                    room: name
                })

                Chat.setState({ success: "The channel \"" + name + "\" has been successfully joined" });
            }
        } else if (response.status === 404) {
            Chat.setState({ error: "The channel \"" + name + "\" couldn't be found" });
        } else {
            Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
        }
    }).catch(err => {
        console.log(err)
        Chat.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
    });
}
export default joinChannel;

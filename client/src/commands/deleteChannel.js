import quitChannel from "../commands/quitChannel"

const deleteChannel = async (name,Chat, socket) => {
    if (name === "" || name === " " || name === null) {
        Chat.setState({ error: "You have to specify a name for the channel you want to delete : \"/delete newChannel\"" });
    } else if (!Chat.state.channels.get(name)) {
        // If does not exist :
        Chat.setState({ error: "You are cannot delete a channel you are not part of : " + name });
    } else {
        // DELETE CHANNEL
        await fetch("http://localhost:9000/api/channels/" + name, {
            method: 'DELETE',
        }).then(response => {
            if (response.status === 200) {

                quitChannel(name, Chat, socket);
                socket.emit('DELETE_ROOM', {
                    room: name
                })
                Chat.setState({ success: "The channel \"" + name + "\" has been successfully deleted" });
            } else if (response.status === 404) {
                Chat.setState({ error: "The channel \"" + name + "\" couldn't be found" });
            } else {
                Chat.setState({ error: "The channel \"" + name + "\" couldn't be deleted" });
            }
        });
    }
}

export default deleteChannel;

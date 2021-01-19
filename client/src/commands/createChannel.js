import axios from "axios";

const createChannel = async (name, Chat) => {
    if (name === "" || name === " " || name === null) {
        Chat.setState({ error: "You have to specify a name for your new channel : \"/create newChannel\"" });
    } else if (name.length > 45) {
        // If command pas bon format : 
        Chat.setState({ error: "The name of the channel has to be less than 45 characters " });
    } else {
        // CREATE CHANNEL 
        await axios.post("http://localhost:9000/api/channels", { name: name })
            .then(response => {
                if (response.status === 200) {
                    Chat.setState({ success: "The channel \"" + name + "\" has been successfully created" });
                } else {
                    Chat.setState({ error: "The channel \"" + name + "\" couldn't be created" });
                }
            }).catch(err => {
                Chat.setState({ error: "The channel \"" + name + "\" couldn't be created" });
            });
    }
}

export default createChannel;

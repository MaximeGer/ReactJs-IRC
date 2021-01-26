import axios from "axios";
import authService from "../services/auth.service";

const changeNick = async (name, Chat, socket) => {
    if (name !== "") {
        Chat.setState({ username: name });
        socket.emit('SET_NEW_USERNAME', {
            newUsername: name
        })
        console.log(authService.getCurrentUser().id)
        await axios.put('http://localhost:9000/api/users/' + authService.getCurrentUser().id, { username: name })
            .then(response => {
                Chat.setState({ success: "The nickname \"" + name + "\" has been successfully updated" });

                if (response.status === 200) {
                    Chat.setState({ success: "The nickname \"" + name + "\" has been successfully updated" });
                } else {
                    Chat.setState({ error: "The nickname \"" + name + "\" couldn't be updated Success" });
                }
            }).catch(() => {
                Chat.setState({ error: "The nickname \"" + name + "\" couldn't be updated Error" });
            });
    }
}

export default changeNick;

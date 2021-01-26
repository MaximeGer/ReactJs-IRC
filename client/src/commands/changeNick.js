import axios from "axios";
import authService from "../services/auth.service";

const changeNick = async (name, Chat, socket) => {
    if (name !== "") {
        await axios.put('http://localhost:9000/api/users/' + authService.getCurrentUser().id, { username: name })
            .then(() => {
                authService.changeUsername(name)
                Chat.setState({ success: "The nickname \"" + name + "\" has been successfully updated" });      
                

            }).catch(() => {
                Chat.setState({ error: "The nickname \"" + name + "\" couldn't be updated" });
            });
    }
}

export default changeNick;

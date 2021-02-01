const getMessages = async (name, Chat, socket) => {
    if(!Chat.props.parent.state.channels.has(name)){
        await fetch("http://localhost:9000/api/messages/byChannel/" + name, {
            method: 'GET',
        }).then(response => {
            
            return response.json();

        }).then(function(data) {
            data.forEach(message => {
                const div = document.createElement("div");
                div.innerHTML += "<div>" + message.author + " : " + message.message + "</div>";
                document.getElementById(name).querySelector(".messages").appendChild(div)
            });

        }).catch(err => {
            console.log(err)
            Chat.setState({ error: "The messages \"" + name + "\" couldn't be fetched" });
        });
    } else {
        Chat.setState({ error: "The messages \"" + name + "\" couldn't be fetched, you already have fetched it" });

    }


    
}
export default getMessages;

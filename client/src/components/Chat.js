import React from "react";
import ReactDOM from 'react-dom'
import axios from "axios";
import Channel from "./Channel";
import { socket } from "../service/socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'anonymous',
            message: '',
            error: '',
            success: '',
            socketId: '',
            channels: new Map(),
            messages: [],
            elements: [],
            title: "Global Chat"
        };
    }

    componentDidMount(){
        this.renderChannel = (name, id) => {
            return (
                <Channel key={id} title={name} username={this.state.username} onSetUpId={handleNewChildId} parentId={socket.id} />
            );
        }

        const handleNewChildId = (newId, nameChannel) => {
            const addIdToChannel = this.state.channels;
            addIdToChannel.set(nameChannel, newId)
            this.setState({ channels: addIdToChannel })
        }

        socket.emit('JOIN_ROOM', {
            room: this.state.title,
            username: this.state.username
        })

        socket.on('ROOM_LEAVED', (name) => {
            if (document.getElementById('Channel name : ' + name)) {
                document.getElementById('Channel name : ' + name).remove();
            }
        })

        socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        socket.on('RECEIVE_USERS', function (data) {
            console.log(data)
            Array.from(data).forEach(function (username) {
                console.log(username)
                this.setState({ messages: [...this.state.messages, username] });
            })
        });

        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] });
        };


        this.sendMessage = ev => {
            ev.preventDefault();

            var message = this.state.message;
            var nickRegex = new RegExp("^/nick");
            var listRegex = new RegExp("^/list");
            var createRegex = new RegExp("^/create");
            var deleteRegex = new RegExp("^/delete");
            var joinRegex = new RegExp("^/join");
            var quitRegex = new RegExp("^/quit");
            var usersRegex = new RegExp("^/users");
            var msgRegex = new RegExp("^/msg");

            var commandString = "";
            this.setState({error: ""});
            this.setState({success: ""});

            if (nickRegex.test(message)) {
                console.log(this.state.elements)
                this.setState({ username: message.slice(6) });
                console.log(this.state.elements)
                const nodes = document.querySelectorAll(".row")
                const last = nodes[nodes.length - 1];
                this.state.elements.forEach(element => {
                    console.log(element)
                    element._self.state.username = this.state.username
                    console.log(element)

                    ReactDOM.render(this.renderChannel(element._self.state.title), last)
                })
                console.log(this.state.elements)

            } else if (listRegex.test(message)) {
                commandString = message.slice(6);
                if (commandString === "" || commandString === " " || commandString === null) {
                    // DISPLAY ALL CHANNEL
                    console.log("Display all channel available " + commandString);
                    // TODO Display all channel available
                } else {
                    // DISPLAY ALL CHANNEL OF A STRING
                    console.log("Display all channel available according to the string : " + commandString);
                    // TODO Display all channel available according to a string
                }
            } else if (createRegex.test(message)) {
                commandString = message.slice(8);
                createChannel(commandString);

            } else if (deleteRegex.test(message)) {
                commandString = message.slice(8);
                deleteChannel(commandString);

            } else if (joinRegex.test(message)) {
                commandString = message.slice(6);
                joinChannel(commandString);

            } else if (quitRegex.test(message)) {
                commandString = message.slice(6);
                quitChannel(commandString);

            } else if (usersRegex.test(message)) {
                commandString = message.slice(7);

                // LIST ALL USERS
                console.log("List users on the channel");
                socket.emit('ASK_USERS', {
                    room: this.state.title
                })

            } else if (msgRegex.test(message)) {
                commandString = message.slice(5);
                var nickToSend = commandString.substr(0, commandString.indexOf(' '));
                var messageToSend = commandString.substr(commandString.indexOf(' ') + 1);
                if (messageToSend === "" || messageToSend === null || nickToSend === "" || nickToSend === null) {
                    this.setState({ error: "You have to specify a name and a message to send  : \"/msg nickname message\"" });
                } else {
                    // SEND MESSAGE
                    console.log("Send \"" + messageToSend + "\" to the user with the name : " + nickToSend);
                }
            } else {
                // NORMAL MESSAGE TO THE CHANNEL
                // SAVE TO BDD - with author + message + channel + time? 
                socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: message,
                    room: this.state.title
                })


            }
            this.setState({ message: '' });
        }

        const createChannel = async name => {
            if (name === "" || name === " " || name === null) {
                this.setState({ error: "You have to specify a name for your new channel : \"/create newChannel\"" });
            } else if (name.length > 45) {
                // If command pas bon format : 
                this.setState({ error: "The name of the channel has to be less than 45 characters " });
            } else {
                // CREATE CHANNEL 
                await axios.post("http://localhost:9000/api/channels", { name: name })
                    .then(response => {
                        if (response.status === 200) {
                            this.setState({ success: "The channel \"" + name + "\" has been successfully created" });
                        } else {
                            this.setState({ error: "The channel \"" + name + "\" couldn't be created" });
                        }
                    }).catch(err => {
                        this.setState({ error: "The channel \"" + name + "\" couldn't be created" });
                    });
            }
        }


        const joinChannel = async name => {
            var channelExists = false;
            var id;
            await fetch("http://localhost:9000/api/channels/byName/" + name, {
                method: 'GET',
            }).then(response => {
                if (response.status === 200) {
                    this.setState({ success: "The channel \"" + name + "\" has been successfully joined" });
                    channelExists = true;
                    id = response.id;
                } else if (response.status === 404) {
                    this.setState({ error: "The channel \"" + name + "\" couldn't be found" });
                } else {
                    this.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
                }
            }).catch(err => {
                this.setState({ error: "The channel \"" + name + "\" couldn't be joined" });
            });

            if (name === "" || name === " " || name === null) {
                this.setState({ error: "You have to specify a name for the channel you want to join : \"/join newChannel\"" });
            } else if (!channelExists) {
                // If does not exist :
                this.setState({ error: "This channel does not exist : " + name });
            } else {
                // JOIN CHANNEL DB + SOCKET.IO
                console.log("Join the channel with the name : " + name);
                var div = document.createElement("div");
                div.className = "row"

                document.querySelector(".container").append(div)
                const nodes = document.querySelectorAll(".row")
                const last = nodes[nodes.length - 1];

                const element = this.renderChannel(name, id);

                ReactDOM.render(element, last)
                //this.setState({ elements: [...this.state.elements, element] });
                this.setState({ elements: [...this.state.elements, element] });

                var test = new Map(this.state.channels);
                test.set(name, "");

                // React.createElement(element, document.querySelector("body"))
                this.setState({ channels: test });
                console.log(this.state.channels)

            }
        }


        const deleteChannel = async name => {
            if (name === "" || name === " " || name === null) {
                this.setState({ error: "You have to specify a name for the channel you want to delete : \"/delete newChannel\"" });
            } else if (!this.state.channels.get(name)) {
                // If does not exist :
                this.setState({ error: "You are cannot delete a channel you are not part of : " + name });
            } else {
                // DELETE CHANNEL
                await fetch("http://localhost:9000/api/channels/" + name, {
                    method: 'DELETE',
                }).then(response => {
                    if (response.status === 200) {

                        quitChannel(name);
                        socket.emit('DELETE_ROOM', {
                            room: name
                        })
                        this.setState({ success: "The channel \"" + name + "\" has been successfully deleted" });
                    } else if (response.status === 404) {
                        this.setState({ error: "The channel \"" + name + "\" couldn't be found" });
                    } else {
                        this.setState({ error: "The channel \"" + name + "\" couldn't be deleted" });
                    }
                });
            }
        }

        const quitChannel = name => {
            if (name === "" || name === " " || name === null) {
                this.setState({ error: "You have to specify a name for the channel you want to quit : \"/quit newChannel\"" });
            } else if (!this.state.channels.get(name)) {
                // If not part of this channel :
                this.setState({ error: "You are not part of this channel : " + name });
            } else {
                // QUIT CHANNEL
                console.log("Quit the channel with the name : " + name + " if it exist and you joined it");
                //this.state.channels.splice(name, 1);

                var idToDisconnect = this.state.channels.get(name);
                socket.emit('QUIT_ROOM', {
                    id: idToDisconnect,
                    room: name
                })

                this.state.channels.delete(name);
            }
        }
    }

    render() {
        return (
            <div className="col-4">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">{this.state.title}</div>
                        <hr />
                        <div className="messages">
                            {this.state.messages.map(message => {
                                return (
                                    <div>{message.author} : {message.message}</div>
                                )
                            })}
                        </div>

                    </div>
                    <div className="card-footer">
                        <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                        <div className="errorCommands">{this.state.error}</div>
                        <br />
                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
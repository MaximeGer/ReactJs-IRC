import React from "react";
import ReactDOM from 'react-dom'
import createChannel from "../commands/createChannel"
import joinChannel from "../commands/joinChannel"
import deleteChannel from "../commands/deleteChannel"
import quitChannel from "../commands/quitChannel"
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

    componentDidMount() {
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

        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] });
        };

        socket.on('RECEIVE_USERS', function (data) {
            console.log(data.listUsers)
            //this.setState({ messages: [...this.state.messages, 'Users on the channel :'] });
            addMessage({
                author: "System",
                message: "list of all users on the channel : ",
                separator: " : "
            })
            data.listUsers.forEach(username => {
                addMessage({
                    author: "",
                    message: username,
                    separator: " - "
                })
            })
        });



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
            this.setState({ error: "" });
            this.setState({ success: "" });

            if (nickRegex.test(message)) {
                this.setState({ username: message.slice(6) });
                const nodes = document.querySelectorAll(".row")
                const last = nodes[nodes.length - 1];
                this.state.elements.forEach(element => {
                    element._self.state.username = this.state.username
                    ReactDOM.render(this.renderChannel(element._self.state.title), last)
                })

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
                createChannel(commandString, this);

            } else if (deleteRegex.test(message)) {
                commandString = message.slice(8);
                deleteChannel(commandString, this, socket);

            } else if (joinRegex.test(message)) {
                commandString = message.slice(6);
                joinChannel(commandString, this);

            } else if (quitRegex.test(message)) {
                commandString = message.slice(6);
                quitChannel(commandString, this, socket);

            } else if (usersRegex.test(message)) {
                showUsers(this.state.title);

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
                    separator: " : ",
                    room: this.state.title
                })


            }
            this.setState({ message: '' });
        }

        const showUsers = roomName => {
            // LIST ALL USERS
            socket.emit('ASK_USERS', {
                room: roomName
            })
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
                                    <div>{message.author} {message.separator} {message.message}</div>
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
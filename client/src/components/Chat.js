import React from "react";
import privateMessage from "../commands/privateMessage"
import changeNick from "../commands/changeNick"
import createChannel from "../commands/createChannel"
import joinChannel from "../commands/joinChannel"
import deleteChannel from "../commands/deleteChannel"
import quitChannel from "../commands/quitChannel"
import showUsers from "../commands/showUsers"
import listChannels from "../commands/listChannels"
import commonReceiveFunctions from "../socket/commonReceiveFunctions"
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
            title: "Global Chat"
        };
    }

    componentDidMount() {
        socket.emit('JOIN_ROOM', {
            room: this.state.title,
            username: this.state.username
        })

        socket.on('ROOM_LEAVED', (name) => {
            if (document.getElementById('Channel name : ' + name)) {
                document.getElementById('Channel name : ' + name).remove();
            }
        })

        socket.on('RECEIVE_ERROR', function (data) {
            console.log(data.message)
            this.setState({ error: data.message });
        });


        commonReceiveFunctions(socket, this);

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
                commandString = message.slice(6);
                changeNick(commandString, this, socket);

            } else if (listRegex.test(message)) {
                commandString = message.slice(6);
                listChannels(commandString, this)

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
                showUsers(this.state.title, socket);

            } else if (msgRegex.test(message)) {
                commandString = message.slice(5);
                privateMessage(commandString, this, socket);
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
    }

    render() {
        return (
            <div className="col-12">
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
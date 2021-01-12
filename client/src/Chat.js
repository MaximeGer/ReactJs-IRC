import React from "react";
import ReactDOM from 'react-dom'
import io from "socket.io-client";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
            error: '',
            channels: [],
            messages: [],
            title: this.props.title || "Global Chat"
        };

        this.socket = io('localhost:9000');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            
            this.setState({ messages: [...this.state.messages, data] });
            //console.log(this.state.messages);
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
            this.state.error = "";

            if (nickRegex.test(message)) {
                this.state.username = message.slice(6);

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
                if (commandString === "" || commandString === " " || commandString === null) {
                    this.state.error = "You have to specify a name for your new channel : \"/create newChannel\"";
                } else if (false) {
                    // If command pas bon format : 
                    this.state.error = "The name of your new channel have to be of the format : ";
                } else {
                    // CREATE CHANNEL 
                    console.log("Create a channel with the name : " + commandString);
                }
            } else if (deleteRegex.test(message)) {
                commandString = message.slice(8);
                if (commandString === "" || commandString === " " || commandString === null) {
                    this.state.error = "You have to specify a name for the channel you want to delete : \"/delete newChannel\"";
                } else if (false) {
                    // If does not exist :
                    this.state.error = "This channel has already been deleted or does not exist : ";
                } else {
                    // DELETE CHANNEL
                    console.log("Delete the channel with the name : " + commandString + ", if it exist");
                }

            } else if (joinRegex.test(message)) {
                commandString = message.slice(6);
                if (commandString === "" || commandString === " " || commandString === null) {
                    this.state.error = "You have to specify a name for the channel you want to join : \"/join newChannel\"";
                } else if (false) {
                    // If does not exist :
                    this.state.error = "This channel does not exist : ";
                } else {
                    // JOIN CHANNEL DB + SOCKET.IO
                    console.log("Join the channel with the name : " + commandString);
                    var div = document.createElement("div");
                    div.className = "row"
                    document.querySelector(".container").append(div)
                    const nodes = document.querySelectorAll(".row")
                    const last = nodes[nodes.length-1];
                    const element = <Chat title="test"/>;
                    ReactDOM.render(element, last )
                    // React.createElement(element, document.querySelector("body"))
                    this.setState({ channels: [...this.state.channels, commandString] });
                    this.socket.emit('JOIN_ROOM', {
                        room: commandString
                    })
                }

            } else if (quitRegex.test(message)) {
                commandString = message.slice(6);
                if (commandString === "" || commandString === " " || commandString === null) {
                    this.state.error = "You have to specify a name for the channel you want to quit : \"/quit newChannel\"";
                } else if (false) {
                    // If does not exist :
                    this.state.error = "This channel does not exist : ";
                } else if (false) {
                    // If not part of this channel :
                    this.state.error = "You are not part of this channel : ";
                } else {
                    // QUIT CHANNEL
                    console.log("Quit the channel with the name : " + commandString + " if it exist and you joined it");
                    this.state.channels.forEach(channel => {
                        if (channel === commandString) {
                            channel = null;
                        }
                    })

                }
            } else if (usersRegex.test(message)) {
                commandString = message.slice(7);
                // LIST ALL USERS
                console.log("List users on the channel");

            } else if (msgRegex.test(message)) {
                commandString = message.slice(5);
                var nickToSend = commandString.substr(0, commandString.indexOf(' '));
                var messageToSend = commandString.substr(commandString.indexOf(' ') + 1);
                if (messageToSend === "" || messageToSend === null || nickToSend === "" || nickToSend === null) {
                    this.state.error = "You have to specify a name and a message to send  : \"/msg nickname message\"";
                } else {
                    // SEND MESSAGE
                    console.log("Send \"" + messageToSend + "\" to the user with the name : " + nickToSend);
                }




            } else {
                // NORMAL MESSAGE TO THE CHANNEL
                // SAVE TO BDD - with author + message + channel + time? 
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: message,
                    rooms: this.state.channels
                })
                console.log("channels : " + this.state.channels);

            }
            this.setState({ message: '' });
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
                    <div className="channel">
                        {this.state.channels.map(channel => {
                            return (
                                <div className={channel}>
                                    <div className="card-footer">
                                        <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                                        <div className="errorCommands">{this.state.error}</div>
                                        <br />
                                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
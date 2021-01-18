import React from "react";
import io from "socket.io-client";

class Channel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
            messages: [],
            title: this.props.title || "Global Chat",
        };

        this.socket = io('localhost:9000');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        this.socket.emit("JOIN_ROOM", {
            room: this.state.title
        })

        const addMessage = data => {
            console.log(data);

            this.setState({ messages: [...this.state.messages, data] });
            //console.log(this.state.messages);
        };

        const quitRoom = name => {
            this.socket.emit('QUIT_ROOM', {
                room: name
            })
        }

        this.sendMessage = ev => {
            ev.preventDefault();

            var message = this.state.message;
            var listRegex = new RegExp("^/list");

            var commandString = "";

            if (listRegex.test(message)) {
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
            } else {
                // NORMAL MESSAGE TO THE CHANNEL
                // SAVE TO BDD - with author + message + channel + time? 
                this.socket.emit('SEND_MESSAGE', {
                    author: this.state.username,
                    message: message,
                    room: this.state.title
                })
                this.socket.emit('SHOW_ROOM', {
                    room: this.state.title
                })

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
                        <br />
                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Channel;
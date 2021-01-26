import React from "react";
import io from "socket.io-client";
import showUsers from "../commands/showUsers"
import commonReceiveFunctions from "../socket/commonReceiveFunctions"
import { drag, drop, allowDrop } from "../scripts/drag&drop"

class Channel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            message: '',
            error: '',
            success: '',
            messages: [],
            title: this.props.title
        };

        const socket = io('localhost:9000');

        socket.emit("JOIN_ROOM", {
            room: this.props.title,
            username: this.state.username,
            parentId: this.props.parentId
        })

        socket.on('connect', () => {
            this.props.onSetUpId(socket.id, this.props.title)
        });

        socket.on('ROOM_DELETED', (name) => {
            if (document.getElementById('Channel name : ' + name)) {
                document.getElementById('Channel name : ' + name).remove();
            }
        })

        commonReceiveFunctions(socket, this);

        socket.on('RECEIVE_NEW_USERNAME', (data) => {
            this.setState({ username: data.newUsername })
        })

        this.sendMessage = ev => {
            ev.preventDefault();

            var message = this.state.message;
            var usersRegex = new RegExp("^/users");

            if (usersRegex.test(message)) {
                showUsers(this.state.title, socket);

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
            <div className="card" id={this.state.title} draggable={true} onDragStart={drag} onDragOver={allowDrop} onDrop={drop}>
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
                    <br />
                    <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                </div>
            </div>
        );
    }
}

export default Channel;
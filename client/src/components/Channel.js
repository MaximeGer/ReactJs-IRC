import React from "react";
import io from "socket.io-client";
import commonReceiveFunctions from "../socket/commonReceiveFunctions"
import { drag, drop, allowDrop } from "../scripts/drag&drop"
import AuthService from "../services/auth.service";

import sendMessage from "../scripts/sendMessage"


class Channel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            error: '',
            success: '',
            messages: [],
            title: this.props.title
        };

        const socket = io('localhost:9000');

        socket.emit("JOIN_ROOM", {
            room: this.props.title,
            username: AuthService.getCurrentUser().username,
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

        this.sendMessage = ev => {
            ev.preventDefault();

            sendMessage(this, socket);
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
                    <div className="errorCommands">{this.state.error}</div>
                    <div className="successCommands">{this.state.success}</div>
                    <br />
                    <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                </div>
            </div>
        );
    }
}

export default Channel;
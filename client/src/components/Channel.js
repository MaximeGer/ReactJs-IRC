import React from "react";
import io from "socket.io-client";
import commonReceiveFunctions from "../socket/commonReceiveFunctions"
import AuthService from "../services/auth.service";
import { v4 } from 'uuid';

import sendMessage from "../scripts/sendMessage"
import getMessages from "../scripts/getMessages";


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
    }

    componentDidMount() {

        const socket = io('localhost:9000');

        socket.emit("JOIN_ROOM", {
            room: this.props.title,
            username: AuthService.getCurrentUser().username,
        })


        socket.on('connect', () => {
            this.props.onSetUpId(socket.id, this.props.title)
        });

        socket.on('RECEIVE_ERROR', (data) => {
            this.setState({ error: data.message });
        });

        socket.on('ROOM_DELETED', (name) => {
            if (document.getElementById(name)) {
                document.getElementById(name).remove();
            }
            this.props.parent.state.channels.delete(name);

        })

        getMessages(this.state.title,this,socket)

        socket.emit('SEND_MESSAGE', {
            author: "System",
            message: AuthService.getCurrentUser().username + " joined the channel",
            separator: " : ",
            room: this.state.title
        })

        commonReceiveFunctions(socket, this);

        this.sendMessage = ev => {

            ev.preventDefault();

            sendMessage(this, socket);
        }
    }
    render() {
        return (
            <div className="card" id={this.state.title} >
                <div className="card-body">
                    <div className="card-title">{this.state.title}</div>
                    <hr />
                    <div className="messages">
                        {this.state.messages.map(message => {
                            return (
                                <div key={v4()}>{message.author} {message.separator} {message.message}</div>
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
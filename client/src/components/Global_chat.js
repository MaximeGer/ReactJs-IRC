import React from "react";
import { socket } from "../services/socket";

import Channel from "./Channel";
import AuthService from "../services/auth.service";

import commonReceiveFunctions from "../socket/commonReceiveFunctions"

import sendMessage from "../scripts/sendMessage"


class Global_Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: AuthService.getCurrentUser().username,
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
            sendMessage(this, socket);
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

export default Global_Chat;
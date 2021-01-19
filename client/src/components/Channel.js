import React from "react";
import io from "socket.io-client";

class Channel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            message: '',
            messages: [],
            title: this.props.title
        };
        
        const socket = io('localhost:9000');

        socket.emit("JOIN_ROOM", {
            room: this.props.title,
            username:this.state.username,
            parentId: this.props.parentId
        })

        
        socket.on('connect', () => {
            this.props.onSetUpId(socket.id, this.props.title)
        });

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

        socket.on('ROOM_DELETED', (name) => {
            if(document.getElementById('Channel name : ' + name)){
                document.getElementById('Channel name : ' + name).remove();
            }
        })

        socket.on('RECIEVE_NEW_USERNAME', (newUsername) => {
            console.log("yolo'");
            this.setState({username:newUsername})
        })


        this.sendMessage = ev => {
            ev.preventDefault();

            var message = this.state.message;
            var usersRegex = new RegExp("^/users");

            if (usersRegex.test(message)) {
                // LIST ALL USERS
                console.log("List users on the channel");
                socket.emit('ASK_USERS', {
                    room: this.state.title
                })
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
            <div className="col-4" id= {'Channel name : '+ this.state.title}>
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
                        <br />
                        <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Channel;
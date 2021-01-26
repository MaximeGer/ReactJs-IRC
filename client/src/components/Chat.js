import UserService from "../services/user.service";
import React, { Component } from "react";
import Global from "./Global_chat";
import authService from "../services/auth.service";
// import { DragDropContext } from 'react-beautiful-dnd';

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: authService.getCurrentUser().username,
            id: authService.getCurrentUser().id,
            content: ""
        };
    }

    componentDidMount() {
        UserService.getPublicContent().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    render() {
        return (
            
            <div className="Chat">
                <div className="container" id="global">
                    <div className="row">
                        <Global />
                    </div>
                </div>
                <div className="container" id="channels">
                    <div className="row">

                    </div>
                </div>
            </div>

        );
    }
}

export default Chat;
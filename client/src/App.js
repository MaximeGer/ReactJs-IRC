import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser } = this.state;

    if (currentUser) {
      return (

        <BrowserRouter>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/chat"} className="nav-link">
                  Chat
                </Link>
              </li>
            </div>

            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return (
                    <Redirect to="/chat" />
                  )
                }}
              />
              <Route exact path={["/", "/home", "/chat"]} component={Chat} username={AuthService.getCurrentUser()} />
            </Switch>
          </div>
        </BrowserRouter>
      );
    } else {
      return (
        <BrowserRouter>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto"></div>

            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          </nav>
          <div className="container mt-3">
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return (
                    <Redirect to="/login" />
                  )
                }}
              />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </div>
        </BrowserRouter>


      )
    }
  }
}

export default App;
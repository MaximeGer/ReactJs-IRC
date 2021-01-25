import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import enterKeyEvent from './enterKeySendsMessage';
import Chat from "./components/Chat";

ReactDOM.render(
  <React.StrictMode>
    <div className="container" id="global">
      <div className="row">
        <Chat />
      </div>
    </div>
    <div className="container" id="channels">
      <div className="row">

      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
enterKeyEvent();

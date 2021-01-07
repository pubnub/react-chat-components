import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TeamChat from "./group-chat/group-chat";
import EventChat from "./event-chat/event-chat";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/team-chat">
          <TeamChat />
        </Route>
        <Route path="/event-chat">
          <EventChat />
        </Route>
        <Route path="/">
          <div className="welcome">
            <h1>Pubnub Chat Components</h1>
            <h3>Here are the example applications built using our components:</h3>
            <ul>
              <li>
                <a href="/team-chat">Team Chat</a>
              </li>
              <li>
                <a href="/event-chat">Live Event Chat</a>
              </li>
            </ul>
          </div>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

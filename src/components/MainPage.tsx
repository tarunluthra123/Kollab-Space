import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./About";
import LoginPage from "./LoginPage";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface RoomDetails {
  name: string;
  password: string;
}

interface RoomJoinNotification {
  notification: string;
  user: UserInfo;
  room: RoomDetails;
}

interface ChatMessage {
  user: UserInfo;
  message: string;
}

interface Props {
  user: UserInfo | null;
  loginUser: (userInfo: UserInfo) => void;
  logoutUser: () => void;
}

const MainPage: React.FC<Props> = (props) => {
  const [socketValue, setSocketValue] = useState<SocketIOClient.Socket | null>(
    null
  );
  const [currentRoom, setCurrentRoom] = useState<RoomDetails | null>(null);
  const [chatMessageList, setChatMessageList] = useState<Array<any>>([]);

  let socket: SocketIOClient.Socket;

  useEffect(() => {
    if (socketValue === null) {
      socket = socketIOClient(ENDPOINT);
      setSocketValue(socket);
    } else {
      socket = socketValue;
    }
    console.log("ok");
    let counter = 0;
    socket.on("messageReceived", (data: ChatMessage) => {
      const { user, message } = data;
      addMessageToChat(user, message);
      console.log(counter++);
    });

    socket.on("roomJoinNotification", (data: RoomJoinNotification) => {
      console.log("in room join notification");
      const notification = data.notification;
      if (notification === "New Participant") {
        const newUser: UserInfo = data.user;
        if (props.user?.token === newUser.token) {
          //New user is the current user himself
          setCurrentRoom({
            name: data.room.name,
            password: data.room.password,
          });
        } else {
          addFeedEventToChat(newUser.name + " has joined the chatroom.");
        }
      } else if (notification === "Participant Left") {
        const oldUser: UserInfo = data.user;
        console.log(oldUser.name + " left the chat.");
      }
    });

    socket.on("Room does not exist", () => {
      alert("No room with this ID exists.");
    });

    socket.on("Incorrect room password", () => {
      alert("Incorrect room password");
    });
  });

  const addFeedEventToChat = (eventMessage: string) => {
    const timestamp = new Date();
    const feedEvent = { type: "event", eventMessage, timestamp };
    setChatMessageList([...chatMessageList, feedEvent]);
  };

  const addMessageToChat = (user: UserInfo, message: string) => {
    const timestamp = new Date();
    const comment = { type: "comment", user, message, timestamp };
    setChatMessageList([...chatMessageList, comment]);
  };

  return (
    <Layout pageTitle="Home" user={props.user} logoutUser={props.logoutUser}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage
              user={props.user}
              socket={socketValue}
              room={currentRoom}
              chatMessageList={chatMessageList}
            />
          </Route>
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={LoginPage}>
            <LoginPage loginUser={props.loginUser} />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default MainPage;

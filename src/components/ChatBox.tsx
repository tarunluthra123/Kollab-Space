import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Button, Card, Feed } from "semantic-ui-react";
import CSS from "csstype";
import { Accordion, Form, Comment, Segment } from "semantic-ui-react";

const ENDPOINT = "http://127.0.0.1:5000";

const roomButtonStyle: CSS.Properties = {
  margin: "2%",
  marginRight: "3%",
};

const ChatBoxStyle: CSS.Properties = {
  border: "2px",
  marginRight: "10%",
};

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
}

const ChatBox: React.FC<Props> = (props) => {
  const [currentRoom, setCurrentRoom] = useState<RoomDetails | null>(null);
  const [accordionActive, setAccordionActive] = useState<boolean>(false);
  const [chatMessageList, setChatMessageList] = useState<Array<JSX.Element>>(
    []
  );
  const [chatInputBoxMessage, setChatInputBoxMessage] = useState<string>();
  const [socketValue, setSocketValue] = useState<SocketIOClient.Socket | null>(
    null
  );

  let socket: SocketIOClient.Socket;

  useEffect(() => {
    if (socketValue === null) {
      socket = socketIOClient(ENDPOINT);
      setSocketValue(socket);
    } else {
      socket = socketValue;
    }

    socket.on("messageReceived", (data: ChatMessage) => {
      const { user, message } = data;
      const timestamp = new Date();
      console.log("received", data);
      console.log(timestamp);
      addMessageToChat(user, message, timestamp);
    });
  });

  const handleCreateRoom = () => {
    socket.emit("createNewRoom", {
      user: props.user,
    });
    socket.on("New room", (data: any) => {
      console.log(data);
    });
  };

  const handleJoinRoom = (e: any) => {
    const roomName: string = e.target.idInputField.value;
    const roomPassword: string = e.target.passwordInputField.value;
    const room = {
      roomName,
      roomPassword,
    };
    console.log(roomName, roomPassword);
    socket.emit("joinChatRoom", {
      user: props.user,
      room,
    });
    console.log("joinChatRoom emit req done");

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
  };

  const generateFeedEvent = (eventMessage: string, timestamp: Date) => {
    return (
      <Feed>
        <Feed.Event>
          <Feed.Label image={"/"} alt={"img"} />
          <Feed.Content
            date={
              (timestamp.getHours() % 12) +
              ":" +
              timestamp.getMinutes() +
              ` ` +
              (timestamp.getHours() >= 12 ? "PM" : "AM")
            }
            summary={eventMessage}
          />
        </Feed.Event>
      </Feed>
    );
  };

  const generateComment = (
    user: UserInfo,
    message: string,
    timestamp: Date
  ) => {
    return (
      <Comment>
        <Comment.Avatar as="a" src="/images/avatar/small/joe.jpg" alt={"img"} />
        <Comment.Content>
          <Comment.Author>{user.name}</Comment.Author>
          <Comment.Metadata>
            <div>
              {timestamp.getHours() % 12}:{timestamp.getMinutes() + ` `}{" "}
              {timestamp.getHours() >= 12 ? "PM" : "AM"}
            </div>
          </Comment.Metadata>
          <Comment.Text>{message}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  };

  const addFeedEventToChat = (eventMessage: string) => {
    const timestamp = new Date();
    const feedEvent = generateFeedEvent(eventMessage, timestamp);
    setChatMessageList([...chatMessageList, feedEvent]);
  };

  const addMessageToChat = (
    user: UserInfo,
    message: string,
    timestamp: Date
  ) => {
    const comment = generateComment(user, message, timestamp);
    setChatMessageList([...chatMessageList, comment]);
  };

  const sendChatMessage = () => {
    const user = props.user;
    const message = chatInputBoxMessage;
    const room = currentRoom;
    socket.emit("messageReceived", {
      user,
      message,
      room,
    });
    setChatInputBoxMessage("");
  };

  return (
    <div style={ChatBoxStyle}>
      {props.user && !currentRoom && (
        <div
          style={{
            marginRight: "2%",
          }}
        >
          <Accordion>
            <Accordion.Title>
              <Button.Group widths={2}>
                <Button
                  fluid
                  color="teal"
                  style={roomButtonStyle}
                  onClick={() => {
                    setAccordionActive(!accordionActive);
                  }}
                >
                  Join Room
                </Button>
                <Button
                  fluid
                  color="blue"
                  onClick={handleCreateRoom}
                  style={roomButtonStyle}
                >
                  Create Room
                </Button>
              </Button.Group>
            </Accordion.Title>
            <Accordion.Content active={accordionActive}>
              <Form onSubmit={handleJoinRoom}>
                Enter Room Details
                <Form.Field>
                  <label>ID</label>
                  <input
                    placeholder="Room ID"
                    type="text"
                    name="idInputField"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input
                    placeholder="Password"
                    type="password"
                    name="passwordInputField"
                  />
                </Form.Field>
                <Button type="submit">Submit</Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </div>
      )}
      {props.user && currentRoom && (
        <div>
          <Card
            style={{
              marginTop: "5%",
              marginBottom: "5%",
              marginLeft: "5%",
              // margin: "5%",
              padding: "5%",
              marginRight: "0",
            }}
          >
            <Card.Content>
              <Card.Header>Chat Room</Card.Header>
              <Card.Description>
                ID : {currentRoom.name}
                <br />
                Password : {currentRoom.password}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button basic color="green">
                  Invite
                </Button>
                <Button basic color="red">
                  Leave
                </Button>
              </div>
            </Card.Content>
          </Card>
          <Segment raised>
            <Comment.Group>{chatMessageList}</Comment.Group>
            <Form reply>
              <Form.Input
                placeholder="Type your message here"
                onChange={(e: any) => {
                  setChatInputBoxMessage(e.target.value);
                }}
                value={chatInputBoxMessage}
              />
              <Button
                content="Send"
                labelPosition="left"
                icon="edit"
                primary
                onClick={sendChatMessage}
              />
            </Form>
          </Segment>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

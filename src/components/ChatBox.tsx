import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Button, Card, Feed } from "semantic-ui-react";
import CSS from "csstype";
import { Accordion, Form, Comment, Segment } from "semantic-ui-react";

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

interface Props {
  user: UserInfo | null;
  socket: SocketIOClient.Socket | null;
  room: RoomDetails | null;
  chatMessageList: Array<any>;
}

const ChatBox: React.FC<Props> = (props) => {
  const [accordionActive, setAccordionActive] = useState<boolean>(false);
  const currentRoom = props.room;
  const chatMessageList = props.chatMessageList;
  const socketValue = props.socket;

  let socket: SocketIOClient.Socket;

  useEffect(() => {
    if (socketValue) socket = socketValue;
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
  };

  const sendChatMessage = (event: any) => {
    const message = event.target.chatInputBox.value;
    const user = props.user;
    const room = currentRoom;
    socket.emit("messageReceived", {
      user,
      message,
      room,
    });
    event.target.chatInputBox.value = "";
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
          <Segment
            raised
            style={{ overflow: "auto", maxHeight: window.innerHeight / 2 }}
          >
            <Comment.Group>
              {chatMessageList.map((item) => {
                if (item.type === "event") {
                  const { timestamp, eventMessage } = item;
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
                } else {
                  const { user, timestamp, message } = item;
                  return (
                    <Comment>
                      <Comment.Avatar
                        as="a"
                        src="/images/avatar/small/joe.jpg"
                        alt={"img"}
                      />
                      <Comment.Content>
                        <Comment.Author>{user.name}</Comment.Author>
                        <Comment.Metadata>
                          <div>
                            {timestamp.getHours() % 12}:
                            {timestamp.getMinutes() + ` `}{" "}
                            {timestamp.getHours() >= 12 ? "PM" : "AM"}
                          </div>
                        </Comment.Metadata>
                        <Comment.Text>{message}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                }
              })}
            </Comment.Group>
            <Form reply onSubmit={sendChatMessage}>
              <Form.Input
                placeholder="Type your message here"
                name="chatInputBox"
              />
              <Button
                content="Send"
                labelPosition="left"
                icon="edit"
                primary
                type="submit"
              />
            </Form>
          </Segment>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

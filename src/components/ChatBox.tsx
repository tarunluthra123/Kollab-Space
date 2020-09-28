import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Feed,
  Grid,
  Header,
  Input,
  Label,
  Modal,
  TextArea,
} from "semantic-ui-react";
import CSS from "csstype";
import { Accordion, Form, Comment, Segment } from "semantic-ui-react";

const ICON_NUMBER = Math.ceil(Math.random() * 10);

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
  gender: string;
}

interface RoomDetails {
  name: string;
  password: string;
  inviteCode: string;
}

interface Props {
  user: UserInfo | null;
  socket: SocketIOClient.Socket | null;
  room: RoomDetails | null;
  chatMessageList: Array<any>;
  leaveChatRoom: (avatarInfo: { id: number; gender: string }) => void;
}

const ChatBox: React.FC<Props> = (props) => {
  const [accordionActive, setAccordionActive] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState<boolean>(false);
  const [invitationTextCopied, setInvitationTextCopied] = useState<boolean>(
    false
  );
  const currentRoom = props.room;
  const chatMessageList = props.chatMessageList;
  const socketValue = props.socket;

  let socket: SocketIOClient.Socket;
  let avatarInfo: { gender: string; id: number };

  useEffect(() => {
    if (socketValue) socket = socketValue;
  });

  useEffect(() => {
    if (props.user && props.user.gender) {
      avatarInfo = {
        gender: props.user.gender,
        id: ICON_NUMBER,
      };
    }
  });

  const handleCreateRoom = () => {
    socket.emit("createNewRoom", {
      user: props.user,
    });

    socket.on("createdNewRoom", (data: any) => {
      socket.emit("joinChatRoom", {
        user: props.user,
        room: data,
        avatarInfo,
      });
    });
  };

  const handleJoinRoom = (e: any) => {
    const roomName: string = e.target.idInputField.value;
    const roomPassword: string = e.target.passwordInputField.value;
    const room = {
      roomName,
      roomPassword,
    };
    socket.emit("joinChatRoom", {
      user: props.user,
      room,
      avatarInfo,
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
      avatarInfo,
    });
    event.target.chatInputBox.value = "";
  };

  const handleLeaveChatRoom = () => {
    props.leaveChatRoom(avatarInfo);
  };

  const handleJoinViaCode = (event: React.FormEvent<HTMLFormElement> | any) => {
    const inviteCode = event.target.inviteCodeInputField.value;
    socket.emit("joinRoomViaInviteCode", {
      inviteCode,
      user: props.user,
      avatarInfo,
    });

    socket.on("Invalid room invite code", (data: any) => {
      alert("Invalid room invite code");
    });
  };

  const invitationMessage = () => {
    return `Come join me on Kollab Space at ${window.location.href}.\nJoin my chatroom using these credentials :-\nID : ${currentRoom?.name} \nPassword: ${currentRoom?.password}`;
  };

  return (
    <div style={ChatBoxStyle}>
      <Modal
        dimmer={"blurring"}
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        <Modal.Header>Invite your friends</Modal.Header>
        <Modal.Content>
          <Header as="h4">Invite via credentials</Header>
          <label>Share this message with your friends</label>
          <br />
          <Grid>
            <Grid.Column width="10">
              <Form>
                <TextArea
                  defaultValue={invitationMessage()}
                  readOnly
                  rows={3}
                />
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Button
                color="teal"
                icon="copy"
                onClick={() => {
                  setInvitationTextCopied(true);
                  setInviteCodeCopied(false);
                  navigator.clipboard.writeText(invitationMessage());
                }}
              >
                Copy
              </Button>
              {invitationTextCopied && (
                <Label basic color="green" pointing="above">
                  Copied
                </Label>
              )}
            </Grid.Column>
          </Grid>

          <Header as="h4">Invite via Code</Header>
          <label>Share this invitation code with your friends : &nbsp; </label>
          <Input action defaultValue={currentRoom?.inviteCode} readOnly>
            <input readOnly />
            <Button
              color="teal"
              icon="copy"
              onClick={() => {
                setInviteCodeCopied(true);
                setInvitationTextCopied(false);
                navigator.clipboard.writeText(currentRoom?.inviteCode || "");
              }}
            >
              Copy
            </Button>
          </Input>
          {inviteCodeCopied && (
            <Label basic color="green" pointing="left">
              Copied
            </Label>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>
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
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <b>OR</b>
              </div>
              <br />
              <Form onSubmit={handleJoinViaCode}>
                <Form.Field>
                  <label>Enter Invite Code : </label>
                  <input
                    placeholder="Invitation Code"
                    type="text"
                    name="inviteCodeInputField"
                  />
                </Form.Field>
                <Button type="submit">Join via Code</Button>
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
                <Button
                  basic
                  color="green"
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                >
                  Invite
                </Button>
                <Button basic color="red" onClick={handleLeaveChatRoom}>
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
                  const { timestamp, eventMessage, avatarInfo } = item;
                  let avatar: any;
                  const { gender, id } = avatarInfo;
                  if (gender[0] === "M") {
                    avatar = require("../assets/male_avatars/" + id + ".svg");
                  } else {
                    avatar = require("../assets/female_avatars/" + id + ".svg");
                  }

                  return (
                    <Feed>
                      <Feed.Event>
                        <Feed.Label image={avatar} alt={"img"} />
                        <Feed.Content
                          date={
                            (timestamp.getHours() % 12) +
                            ":" +
                            (timestamp.getMinutes() <= 9 ? "0" : "") +
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
                  const { user, timestamp, message, avatarInfo } = item;
                  const { gender, id } = avatarInfo;
                  let avatar: any;
                  if (gender[0] === "M") {
                    avatar = require("../assets/male_avatars/" + id + ".svg");
                  } else {
                    avatar = require("../assets/female_avatars/" + id + ".svg");
                  }
                  return (
                    <Comment>
                      <Comment.Avatar as="a" src={avatar} alt={"img"} />
                      <Comment.Content>
                        <Comment.Author>{user.name}</Comment.Author>
                        <Comment.Metadata>
                          <div>
                            {timestamp.getHours() % 12}:
                            {timestamp.getMinutes() <= 9 ? "0" : ""}
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

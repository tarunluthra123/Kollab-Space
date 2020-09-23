import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Button } from "semantic-ui-react";
import CSS from "csstype";

const ENDPOINT = "http://127.0.0.1:5000";

const roomButtonStyle: CSS.Properties = {
  margin: "2%",
  marginRight: "3%",
  // padding: "1%",
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

interface Props {
  user: UserInfo | null;
}

const ChatBox: React.FC<Props> = (props) => {
  let socket: SocketIOClient.Socket; //Initialised in useEffect hook

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
    socket.emit("msg_send", {
      user: props.user,
      msg: "hello there",
    });
    socket.on("hello there", (data: any) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  });

  const handleCreateRoom = () => {
    socket.emit("createNewRoom", {
      user: props.user,
    });
    socket.on("New room", (data: any) => {
      console.log(data);
    });
  };

  return (
    <div style={ChatBoxStyle}>
      {props.user && (
        <Button.Group widths={2} style={roomButtonStyle}>
          <Button fluid color="teal" style={roomButtonStyle}>
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
      )}
    </div>
  );
};

export default ChatBox;

import React from "react";
import CodeEditor from "./CodeEditor";

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
}

const LeftPanel: React.FC<Props> = (props) => {
  return (
    <div>
      <CodeEditor user={props.user} socket={props.socket} room={props.room} />
    </div>
  );
};

export default LeftPanel;

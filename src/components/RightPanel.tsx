import React from "react";
import ChatBox from "./ChatBox";

interface UserInfo {
  token: string;
  username: string;
  name: string;
  gender: string;
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

const RightPanel: React.FC<Props> = (props) => {
  return (
    <div>
      <ChatBox
        user={props.user}
        socket={props.socket}
        room={props.room}
        chatMessageList={props.chatMessageList}
      />
    </div>
  );
};

export default RightPanel;

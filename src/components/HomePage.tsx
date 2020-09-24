import React from "react";
import VideoScreen from "./VideoScreen";
import RightPanel from "./RightPanel";
import { Grid } from "@material-ui/core";

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

const HomePage: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <VideoScreen />
      </Grid>
      <Grid item xs={3}>
        <RightPanel
          user={props.user}
          socket={props.socket}
          room={props.room}
          chatMessageList={props.chatMessageList}
        />
      </Grid>
    </Grid>
  );
};

export default HomePage;

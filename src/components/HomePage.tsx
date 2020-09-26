import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import Layout from "./Layout";
import { Grid } from "@material-ui/core";

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
  logoutUser: () => void;
}

const HomePage: React.FC<Props> = (props) => {
  return (
    <Layout pageTitle="Home" user={props.user} logoutUser={props.logoutUser}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <LeftPanel
            user={props.user}
            socket={props.socket}
            room={props.room}
          />
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
    </Layout>
  );
};

export default HomePage;

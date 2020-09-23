import React from "react";
import VideoScreen from "./VideoScreen";
import RightPanel from "./RightPanel";
import { Grid } from "@material-ui/core";

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface Props {
  user: UserInfo | null;
}

const HomePage: React.FC<Props> = (props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <VideoScreen />
      </Grid>
      <Grid item xs={3}>
        <RightPanel user={props.user} />
      </Grid>
    </Grid>
  );
};

export default HomePage;

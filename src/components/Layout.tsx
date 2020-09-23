import React from "react";
import { Box } from "@material-ui/core";
import MenuAppBar from "./MenuAppBar";

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface Props {
  user: UserInfo | null;
  logoutUser: () => void;
  pageTitle: string;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <div>
      <MenuAppBar
        pageTitle={props.pageTitle}
        user={props.user}
        logoutUser={props.logoutUser}
      />
      <Box component="span" display="block">
        {props.children}
      </Box>
    </div>
  );
};

export default Layout;

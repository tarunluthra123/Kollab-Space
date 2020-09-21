import React from "react";
import { Box } from "@material-ui/core";
import MenuAppBar from "./MenuAppBar";

interface Props {
  pageTitle: string;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <div>
      <MenuAppBar pageTitle={props.pageTitle} />
      <Box component="span" display="block">
        {props.children}
      </Box>
    </div>
  );
};

export default Layout;

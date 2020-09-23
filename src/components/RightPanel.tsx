import React from "react";
import ChatBox from "./ChatBox";

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface Props {
  user: UserInfo | null;
}

const RightPanel: React.FC<Props> = (props) => {
  return (
    <div>
      <ChatBox user={props.user} />
    </div>
  );
};

export default RightPanel;

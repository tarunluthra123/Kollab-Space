import React from "react";
import Layout from "./Layout";

interface UserInfo {
  token: string;
  username: string;
  name: string;
  gender: string;
}

interface Props {
  user: UserInfo | null;
  logoutUser: () => void;
}

const About: React.FC<Props> = (props) => {
  return (
    <Layout pageTitle="About" user={props.user} logoutUser={props.logoutUser}>
      About Page
    </Layout>
  );
};

export default About;

import React from "react";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";

interface Props {}

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

const App: React.FC<Props> = (props) => {
  const [user, setUser] = React.useState<UserInfo | null>(null);

  return (
    <Layout pageTitle="Home">
      <HomePage />
    </Layout>
  );
};

export default App;

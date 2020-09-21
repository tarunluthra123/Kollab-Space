import React from "react";
import Layout from "./Layout";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./About";
import LoginPage from "./LoginPage";

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface Props {
  user: UserInfo | null;
  loginUser: (userInfo: UserInfo) => void;
  logoutUser: () => void;
}

const MainPage: React.FC<Props> = (props) => {
  return (
    <Layout pageTitle="Home">
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage />
          </Route>
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={LoginPage}>
            <LoginPage loginUser={props.loginUser} />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default MainPage;

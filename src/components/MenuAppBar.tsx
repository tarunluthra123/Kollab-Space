import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CSS from "csstype";
import { Link, HashRouter as Router } from "react-router-dom";
import { Button } from "semantic-ui-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const h1Styling: CSS.Properties = {
  paddingRight: "1%",
  textDecoration: "none",
};

interface UserInfo {
  token: string;
  username: string;
  name: string;
}

interface Props {
  pageTitle: string;
  user: UserInfo | null;
  logoutUser: () => void;
}

const MenuAppBar: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Router>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.pageTitle}
            </Typography>
            <h1 style={h1Styling}>
              <a href="/" style={{ color: "white" }}>
                Kollab Space
              </a>
            </h1>
            {!props.user && (
              <div>
                <Link to="/login">
                  <Button size="large" inverted color="blue">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="large" inverted color="violet">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            {props.user && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <Link to="/profile">
                    <MenuItem
                      onClick={handleClose}
                      style={{
                        color: "black",
                      }}
                    >
                      Profile
                    </MenuItem>
                  </Link>
                  <MenuItem
                    onClick={() => {
                      props.logoutUser();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </Router>
      </AppBar>
    </div>
  );
};

export default MenuAppBar;

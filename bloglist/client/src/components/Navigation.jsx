import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

const Navigation = ({ user, handleLogout }) => (
  <AppBar className="navigationBar" position="static" elevation={0}>
    <Toolbar className="navigationToolbar">
      <Typography
        className="navigationBrand"
        component={RouterLink}
        to="/"
        variant="h6"
      >
        Bloglist
      </Typography>
      <nav className="navigationActions" aria-label="Main navigation">
        {user?.token ? (
          <>
            <span className="navigationUser">{user.name}</span>
            <Button color="inherit" component={RouterLink} to="/">
              Blogs
            </Button>
            <Button color="inherit" component={RouterLink} to="/users">
              Users
            </Button>
            <Button color="inherit" component={RouterLink} to="/create">
              New blog
            </Button>
            <Button className="navigationLogout" onClick={handleLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              Blogs
            </Button>
            <Button color="inherit" component={RouterLink} to="/users">
              Users
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Log in
            </Button>
          </>
        )}
      </nav>
    </Toolbar>
  </AppBar>
);

export default Navigation;

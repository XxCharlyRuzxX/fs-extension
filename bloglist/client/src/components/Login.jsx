import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import loginService from "../services/login";

const LoginForm = ({ setUser, notificationHandler }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      notificationHandler({ message: "Login successful", type: "success" });
    } catch (error) {
      notificationHandler({
        message: `Wrong credentials ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <form className="loginForm" onSubmit={handleLogin}>
      <TextField
        label="Username"
        name="Username"
        autoComplete="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        label="Password"
        name="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button
        className="loginSubmit"
        variant="contained"
        color="secondary"
        type="submit"
      >
        login
      </Button>
    </form>
  );
};

export default LoginForm;

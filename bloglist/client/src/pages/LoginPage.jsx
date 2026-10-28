import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";
import Notification from "../components/Notification";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const notificationHandler = ({ message, type }) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = (user) => {
    setUser(user);
    void navigate("/", { replace: true });
  };

  return (
    <div className="appPage loginPage">
      <section className="loginPanel">
        <h2 className="loginHeading">Log in to application</h2>
        <LoginForm
          setUser={handleLogin}
          notificationHandler={notificationHandler}
        />
      </section>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default LoginPage;

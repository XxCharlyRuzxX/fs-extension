import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login";
import Notification from "../components/Notification";
import { useNotificationStore } from "../services/notificationStore";
import { useUser } from "../context/useUser";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { notify, notification } = useNotificationStore();

  const notificationHandler = ({ message, type }) => {
    notify({ message, type });
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

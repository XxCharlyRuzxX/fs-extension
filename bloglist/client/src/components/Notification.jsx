import Alert from "@mui/material/Alert";

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <Alert className="notification" severity={type === "error" ? "error" : "success"}>
      {message}
    </Alert>
  );
};

export default Notification;
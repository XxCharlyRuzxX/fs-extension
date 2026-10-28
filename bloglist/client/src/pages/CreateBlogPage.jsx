import { useState } from "react";
import { Link } from "react-router-dom";
import CreateBlog from "../components/CreateBlog";
import Notification from "../components/Notification";
import blogService from "../services/blogs";

const CreateBlogPage = () => {
  const [notification, setNotification] = useState(null);

  const notificationHandler = ({ message, type }) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <main className="appPage">
      <p><Link to="/">Back to blogs</Link></p>
      <CreateBlog
        createBlog={blogService.postBlog}
        notificationHandler={notificationHandler}
      />
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </main>
  );
};

export default CreateBlogPage;
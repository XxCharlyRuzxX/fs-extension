import { Link } from "react-router-dom";
import CreateBlog from "../components/CreateBlog";
import Notification from "../components/Notification";
import { useNotificationStore } from "../services/notificationStore";
import { useBlogStore } from "../services/blogStore";

const CreateBlogPage = () => {
  const { notify, notification } = useNotificationStore();
  const { createBlog } = useBlogStore();

  const notificationHandler = ({ message, type }) => {
    notify({ message, type });
  };

  return (
    <main className="appPage">
      <p>
        <Link to="/">Back to blogs</Link>
      </p>
      <CreateBlog
        createBlog={createBlog}
        notificationHandler={notificationHandler}
      />
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </main>
  );
};

export default CreateBlogPage;

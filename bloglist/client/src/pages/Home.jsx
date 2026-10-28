import { useEffect } from "react";
import Blog from "../components/Blog";
import Notification from "../components/Notification";
import { useNotificationStore } from "../services/notificationStore";
import { useBlogStore } from "../services/blogStore";

const Home = ({ user }) => {
  const { blogs, fetchBlogs, updateBlog, deleteBlog } = useBlogStore();
  const { notify, notification } = useNotificationStore();

  useEffect(() => {
    fetchBlogs().catch((error) => {
      console.error("Error fetching blogs:", error);
      notify({
        message: `Error fetching blogs: ${error.message}`,
        type: "error",
      });
    });
  }, [fetchBlogs, notify]);

  const notificationHandler = ({ message, type }) => {
    notify({ message, type });
  };

  return (
    <main className="appPage">
      <header className="appHeader">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h1 className="pageTitle">
            {user?.name ? `${user.name}'s bloglist` : "Bloglist"}
          </h1>
        </div>
      </header>

      <section className="blogSection">
        <h2 className="blogSectionHeading">blogs</h2>

        {blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              notificationHandler={notificationHandler}
            />
          ))}
      </section>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </main>
  );
};

export default Home;

import { useState, useEffect } from "react";
import Blog from "../components/Blog";
import blogService from "../services/blogs";
import Notification from "../components/Notification";

const Home = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchBlogs().catch((error) => {
      console.error("Error fetching blogs:", error);
      setNotification({
        message: `Error fetching blogs: ${error.message}`,
        type: "error",
      });
    });
  }, []);

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs);
  };

  const updateBlog = async (id, updatedBlog) => {
    await blogService.updateBlog(id, updatedBlog);
    await fetchBlogs();
  };

  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id);
    await fetchBlogs();
  };

  const notificationHandler = ({ message, type }) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
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
        <h2 className="blogSectionHeading">Latest blogs</h2>

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

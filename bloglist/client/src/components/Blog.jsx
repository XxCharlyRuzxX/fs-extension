import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const Blog = ({ blog, user, updateBlog, deleteBlog, notificationHandler }) => {
  const [isdetailsVisible, setIsdetailsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [author, setAuthor] = useState(blog.author);
  const [url, setUrl] = useState(blog.url);
  const isOwner = user?.username === blog.user?.username;

  const toggleDetailsVisibility = () => {
    setIsdetailsVisible(!isdetailsVisible);
  };

  const likeHandler = async () => {
    await updateBlog(blog.id, { likes: blog.likes + 1 });
  }

  const deleteHandler = async () => {
    if (window.confirm(`Are you sure you want to delete the blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await deleteBlog(blog.id);
        notificationHandler({ message: `Blog "${blog.title}" by ${blog.author} has been deleted.`, type: "success" });
      } catch (error) {
        console.error("Error deleting blog:", error);
        notificationHandler({ message: `Failed to delete the blog: ${error.message}`, type: "error" });
      }
    }
  }

  const editHandler = async (event) => {
    event.preventDefault();

    try {
      await updateBlog(blog.id, { title, author, url, likes: blog.likes });
      setIsEditing(false);
      notificationHandler({ message: `Blog "${title}" updated`, type: "success" });
    } catch (error) {
      notificationHandler({ message: `Failed to update the blog: ${error.message}`, type: "error" });
    }
  };

  if (isdetailsVisible) {
    return (
      <article className="blogCard">
        {isEditing ? (
          <>
            <h3 className="blogTitle">{blog.title}</h3>
            <form className="blogEditForm" onSubmit={editHandler}>
              <TextField label="Title" value={title} onChange={({ target }) => setTitle(target.value)} />
              <TextField label="Author" value={author} onChange={({ target }) => setAuthor(target.value)} />
              <TextField label="URL" value={url} onChange={({ target }) => setUrl(target.value)} />
              <div className="blogEditActions">
                <Button variant="contained" color="secondary" type="submit">Update</Button>
                <Button variant="outlined" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div>
              <h3 className="blogTitle">{blog.title}</h3>
              <p className="blogAuthor">{blog.author}</p>
              <p><a className="blogLink" href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
              <div>
                <p className="blogLikes">Likes: <strong>{blog.likes}</strong></p>
                <button className="blogActionButton" onClick={likeHandler}>
                  like
                </button>
              </div>
            </div>
            {isOwner && (
              <>
                <button className="blogActionButton" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="blogActionButton blogDeleteButton" onClick={deleteHandler}>
                  delete blog
                </button>
              </>
            )}
          </>
        )}
        <button className="blogActionButton blogToggleButton" onClick={toggleDetailsVisibility}>
          {isdetailsVisible ? "hide" : "show"}
        </button>
      </article>
    );
  }
  return (
    <article className="blogCard blogCardCompact">
      <span>
        <Link to={`/blogs/${blog.id}`}><strong>{blog.title}</strong></Link>{" "}
        <span className="blogAuthorInline">{blog.author}</span>
      </span>
      <button className="blogActionButton blogToggleButton" onClick={toggleDetailsVisibility}>
        {isdetailsVisible ? "hide" : "show"}
      </button>
    </article>
  );
};

export default Blog;

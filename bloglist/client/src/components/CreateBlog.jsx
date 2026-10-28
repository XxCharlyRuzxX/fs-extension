import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const CreateBlog = ({ createBlog, notificationHandler, closeForm }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title,
        author,
        url,
      };
      await createBlog(newBlog);
      notificationHandler({
        message: `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        type: "success",
      });
      closeForm?.();
    } catch (error) {
      notificationHandler({
        message: `Error creating blog ${error.message}`,
        type: "error",
      });
    }
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form className="createBlogForm" onSubmit={handleSubmit}>
      <h2 className="createBlogHeading">Create a new blog</h2>
      <TextField label="Title" name="Title" value={title} onChange={({ target }) => setTitle(target.value)} />
      <TextField label="Author" name="Author" value={author} onChange={({ target }) => setAuthor(target.value)} />
      <TextField label="URL" name="Url" value={url} onChange={({ target }) => setUrl(target.value)} />
      <Button className="createBlogSubmit" variant="contained" color="secondary" type="submit">
        Create
      </Button>
    </form>
  );
};

export default CreateBlog;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import blogService from "../services/blogs";
import { useBlogStore } from "../services/blogStore";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const updateBlog = useBlogStore((state) => state.updateBlog);

  useEffect(() => {
    let isActive = true;

    blogService
      .getAll()
      .then((blogs) => {
        if (isActive) {
          setBlog(blogs.find((item) => item.id === id) ?? null);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };

  }, [id]);

  const likeHandler = async () => {
    if (!blog || isLiking) {
      return;
    }

    setIsLiking(true);
    setError(null);
    try {
      const updatedBlog = await updateBlog(blog.id, { likes: blog.likes + 1 });
      setBlog(updatedBlog);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLiking(false);
    }
  };

  const commentHandler = async (event) => {
    event.preventDefault();
    if (!blog || !comment.trim() || isCommenting) {
      return;
    }

    setIsCommenting(true);
    setError(null);
    try {
      const updatedBlog = await blogService.addComment(blog.id, comment);
      setBlog(updatedBlog);
      setComment("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <main className="appPage">
      <p className="backLink">
        <Link to="/">Back to blogs</Link>
      </p>
      {loading && <p>Loading blog...</p>}
      {!loading && error && <p role="alert">Could not load blog: {error}</p>}
      {!loading && !error && !blog && <p>Blog not found.</p>}
      {!loading && blog && (
        <article className="blogCard blogDetail">
          <h1 className="blogTitle">{blog.title}</h1>
          <p className="blogAuthor">{blog.author}</p>
          <p>
            <a
              className="blogLink"
              href={blog.url}
              target="_blank"
              rel="noreferrer"
            >
              {blog.url}
            </a>
          </p>
          <p className="blogLikes">
            Likes: <strong>{blog.likes}</strong>
          </p>
          <Button
            variant="contained"
            color="secondary"
            onClick={likeHandler}
            disabled={isLiking}
          >
            {isLiking ? "Liking..." : "Like"}
          </Button>
          <p>Added by {blog.user.name}</p>
          <section aria-labelledby="comments-heading">
            <h2 id="comments-heading">Comments</h2>
            <form onSubmit={commentHandler}>
              <TextField
                label="Comment"
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                fullWidth
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={isCommenting || !comment.trim()}
              >
                {isCommenting ? "Adding..." : "Add comment"}
              </Button>
            </form>
            <ul>
              {(blog.comments ?? []).map((blogComment, index) => (
                <li key={`${blog.id}-comment-${index}`}>{blogComment}</li>
              ))}
            </ul>
          </section>
        </article>
      )}
    </main>
  );
};

export default BlogPage;

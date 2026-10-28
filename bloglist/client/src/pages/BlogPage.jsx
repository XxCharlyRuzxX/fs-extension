import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import blogService from "../services/blogs";
import { useBlogStore } from "../services/blogStore";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
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
          {blog.user?.name && <p>Added by {blog.user.name}</p>}
        </article>
      )}
    </main>
  );
};

export default BlogPage;

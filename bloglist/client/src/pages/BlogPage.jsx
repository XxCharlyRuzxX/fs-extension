import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import blogService from "../services/blogs";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {blog.user?.name && <p>Added by {blog.user.name}</p>}
        </article>
      )}
    </main>
  );
};

export default BlogPage;

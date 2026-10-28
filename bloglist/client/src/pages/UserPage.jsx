import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import usersService from "../services/users";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersService
      .getAll()
      .then((users) => setUser(users.find((item) => item.id === id) ?? null))
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  return (
    <main className="appPage">
      <p className="backLink">
        <Link to="/users">Back to users</Link>
      </p>
      {error && <p role="alert">Could not load user: {error}</p>}
      {!error && !user && <p>User not found.</p>}
      {!error && user && (
        <>
          <h1 className="pageTitle">{user.name}</h1>
          <p>@{user.username}</p>
          <h2 className="blogSectionHeading">Blogs added</h2>
          <ul>
            {user.blogs?.map((blog) => <li key={blog.id}>{blog.title}</li>)}
          </ul>
        </>
      )}
    </main>
  );
};

export default UserPage;

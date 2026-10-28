import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import usersService from "../services/users";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersService
      .getAll()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <main className="appPage">
      <header className="appHeader">
        <div>
          <p className="eyebrow">COMMUNITY</p>
          <h1 className="pageTitle">Users</h1>
        </div>
      </header>

      {error && <p role="alert">Could not load users: {error}</p>}
      {!error && (
        <table className="usersTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.username}</td>
                <td>{user.blogs?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default UsersPage;

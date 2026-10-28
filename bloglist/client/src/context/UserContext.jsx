import { createContext, useMemo, useState } from "react";

const UserContext = createContext(null);

const readStoredUser = () => {
  const storedUser = window.localStorage.getItem("loggedBlogappUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(readStoredUser);

  const setUser = (nextUser) => {
    if (nextUser) {
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem("loggedBlogappUser");
    }
    setUserState(nextUser);
  };

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };

import { createContext, useMemo, useState } from "react";
import { getUser, removeUser, saveUser } from "../services/persistentUser";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser);

  const setUser = (nextUser) => {
    if (nextUser) {
      saveUser(nextUser);
    } else {
      removeUser();
    }
    setUserState(nextUser);
  };

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };

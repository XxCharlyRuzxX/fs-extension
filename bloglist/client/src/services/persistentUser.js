const storageKey = "loggedBlogappUser";

export const getUser = () => {
  const storedUser = window.localStorage.getItem(storageKey);
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user));
};

export const removeUser = () => {
  window.localStorage.removeItem(storageKey);
};

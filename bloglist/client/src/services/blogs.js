import axios from "axios";
import { getUser } from "./persistentUser";

const baseUrl = "/api/blogs";

const getAll = () => axios.get(baseUrl).then((response) => response.data);

const postBlog = (newBlog) => {
  const user = getUser();
  if (!user) {
    throw new Error("User not logged in");
  }

  return axios
    .post(baseUrl, newBlog, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then((response) => response.data);
};

const updateBlog = (id, updatedBlog) =>
  axios.put(`${baseUrl}/${id}`, updatedBlog).then((response) => response.data);

const deleteBlog = (id) => {
  const user = getUser();
  if (!user) {
    throw new Error("User not logged in");
  }

  return axios
    .delete(`${baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then((response) => response.data);
};

const addComment = (id, comment) =>
  axios
    .post(`${baseUrl}/${id}/comments`, { comment })
    .then((response) => response.data);

export default { getAll, postBlog, updateBlog, deleteBlog, addComment };

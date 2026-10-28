import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postBlog = (newBlog) => {
  const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
  if (!loggedUserJSON) {
    throw new Error("User not logged in");
  }
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(loggedUserJSON).token}` }
  }

  const request = axios.post(baseUrl, newBlog, config)
  return request.then(response => response.data)
}

const updateBlog = (id, updatedBlog) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedBlog)
  return request.then(response => response.data)
}

const deleteBlog = (id) => {

  const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
  if (!loggedUserJSON) {
    throw new Error("User not logged in");
  }
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(loggedUserJSON).token}` }
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll , postBlog, updateBlog , deleteBlog }
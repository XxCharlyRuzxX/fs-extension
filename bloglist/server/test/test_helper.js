const Blog = require('../model/blog')
const User = require('../model/user')

const initialBlog = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'http://example.com/html-is-easy',
    likes: 10
  },
  {
    title: 'JavaScript is hard',
    author: 'Jane Smith',
    url: 'http://example.com/javascript-is-hard',
    likes: 5
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const note = new Blog({ title: 'willremovethissoon', author: 'John Doe', url: 'http://example.com/willremovethissoon', likes: 0 })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs: initialBlog,
  nonExistingId,
  blogsInDb,
  usersInDb
}
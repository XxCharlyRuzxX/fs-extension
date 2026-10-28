const blogsRouter = require('express').Router()
const Blog = require('../model/blog')
const User = require('../model/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const newblog = new Blog({ ...request.body, user: user._id })

  if (!newblog.title || !newblog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (!newblog.likes) {
    newblog.likes = 0
  }

  const result = await newblog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete the blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog._id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
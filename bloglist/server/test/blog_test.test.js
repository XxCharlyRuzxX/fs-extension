const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const supertest = require('supertest')
const Blog = require('../model/blog')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
  token = loginResponse.body.token

  let blogObject = new Blog(helper.initialBlogs[0])
  blogObject.user = user._id
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  blogObject.user = user._id
  await blogObject.save()
})

test('blogs count returned as json is correct', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body[0].id)
})

test('a valid blog be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Alice Johnson',
    url: 'http://example.com/new-blog',
    likes: 0
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('a blog without token is not added', async () => {
  const newBlog = {
    title: 'New Blog Without Token',
    author: 'Alice Johnson',
    url: 'http://example.com/new-blog-no-token',
    likes: 0
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Alice Johnson',
    url: 'http://example.com/blog-without-likes'
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[response.body.length - 1].likes, 0)
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'Alice Johnson',
    likes: 0
  }

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a blog be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedBlogData = {
    title: 'Updated Blog Title',
    author: 'Updated Author',
    url: 'http://example.com/updated-blog',
    likes: 5
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd[0].title, updatedBlogData.title)
  assert.strictEqual(blogsAtEnd[0].author, updatedBlogData.author)
  assert.strictEqual(blogsAtEnd[0].url, updatedBlogData.url)
  assert.strictEqual(blogsAtEnd[0].likes, updatedBlogData.likes)
})

test('updating a populated blog does not try to replace its user', async () => {
  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0]

  await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
    .expect(200)

  const updatedBlog = await Blog.findById(blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
  assert.strictEqual(updatedBlog.user.toString(), blogToUpdate.user.id)
})

test('a blog be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})


after(() => {
  mongoose.connection.close()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import CreateBlog from './CreateBlog'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('Blog component', () => {
  const blog = {
    id: 'blog-id',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com/test-blog',
    likes: 5,
  }
  let mockLikeHandler

  beforeEach(() => {
    mockLikeHandler = vi.fn()
    render(
      <MemoryRouter>
        <Blog blog={blog} updateBlog={mockLikeHandler} />
      </MemoryRouter>
    )
  })

  test('renders title and author and not url and likes by default', () => {
    expect(screen.getByText(blog.title)).toBeInTheDocument()
    expect(screen.getByText(blog.author)).toBeInTheDocument()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(document.querySelector('.blogLikes')).not.toBeInTheDocument()
  })

  test('renders url and likes when the view button is clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'show' }))

    expect(screen.getByRole('link', { name: blog.url })).toBeInTheDocument()
    expect(document.querySelector('.blogLikes')).toHaveTextContent(String(blog.likes))
  })

  test('calls the like handler twice when the like button is clicked twice', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'show' }))
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})

describe('CreateBlog component', () => {
  test('calls createBlog with the entered title, author, and url', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()
    render(
      <CreateBlog
        createBlog={mockCreateBlog}
        notificationHandler={vi.fn()}
        closeForm={vi.fn()}
      />
    )

    await user.type(screen.getByLabelText('Title'), 'New Blog Title')
    await user.type(screen.getByLabelText('Author'), 'New Blog Author')
    await user.type(screen.getByLabelText('URL'), 'http://example.com/new-blog')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'http://example.com/new-blog'
    })
  })
})
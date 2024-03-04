import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'



test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const blog = {
    title: 'Here is a title',
    author: 'Jeff Bezos',
    url: 'https://fullstackopen.com/'
  }

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('save')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)
})
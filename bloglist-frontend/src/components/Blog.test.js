import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'React Tutorial',
  author: 'Jaska Jokunen',
  url: 'https://fullstackopen.com/',
  user: {
    id: 'qwertyuiop',
    name: 'Niilo Ikonen',
    username: 'NIkonen'
  }
}

describe('blog tests', () => {
  test('renders content', () => {
    //screen.debug()
    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'React Tutorial'
    )
  })

  test('clicking the show more button shows url', async () => {
    render(<Blog blog={blog} />)

    const button = screen.getByText('show')
    const user = userEvent.setup()

    expect(screen.queryByText(blog.url)).toBeNull()
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeInTheDocument()

  })

  test('pressing like twice makes prop eventhandler be called twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} likeBlog={mockHandler}/>)

    const showButton = screen.getByText('show')
    const user = userEvent.setup()
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

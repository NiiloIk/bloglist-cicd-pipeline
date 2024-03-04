import { useState, useImperativeHandle, forwardRef } from 'react'

const Blog = forwardRef(({ blog, likeBlog, removeBlog, user }, ref) => {
  const [viewMore, setViewMore] = useState(false)
  const [buttonText, setButtonText] = useState('show')

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    if (viewMore) {
      setViewMore(false)
      setButtonText('show')
    } else {
      setViewMore(true)
      setButtonText('hide')
    }
  }

  const handleLike = (event) => {
    event.preventDefault()
    blog.likes += 1
    likeBlog(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    removeBlog(blog)
  }

  useImperativeHandle(ref, () => {
    return {
      handleLike,
      handleRemove
    }
  })

  return (
    <div style={blogStyle} className='blog'>

      <p>{blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonText}</button></p>
      {viewMore &&
        <>
          <a className='url' href={blog.url}>{blog.url}</a>
          <p className='likes'>{blog.likes} <button onClick={handleLike}>like</button></p>
          <p className='username'>{blog.user.name}</p>
          {user && 
            <button className='removeButton' onClick={handleRemove}>remove</button>
          }
          
        </>
      }
    </div>
  )}
)

Blog.displayName = 'Blog'

export default Blog
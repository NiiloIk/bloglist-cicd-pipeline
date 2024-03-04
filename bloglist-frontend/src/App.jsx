import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  const blogRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setMessageHandler = (message, errorBoolean) => {
    setError(errorBoolean)
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setMessageHandler(`logged in as ${username}`, false)
      setUser(user)
    } catch (exception) {
      // setMessageHandler(exception.response.data.error) antaa backendistä vastauksen
      setMessageHandler('wrong username or password', true)
    }
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    setUser(null)
    setMessageHandler('logged out', false)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => {
    return (
      <div>
        <div>
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </div>
      </div>
    )
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        setBlogs(blogs.concat(returnedBlog))
        setMessageHandler(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`)
      })
  }

  const likeBlog = (blogObject) => {
    const user = blogObject.user.id
    const changedBlog = { ...blogObject, user }

    blogService
      .update(blogObject.id, changedBlog)
      .then(() => {
        setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : blogObject))
        setMessageHandler(`${blogObject.title} liked`)
      })
  }

  const removeBlog = (blogObject) => {
    const blogId = blogObject.id

    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)){
      blogService
        .deleteBlog(blogId)
        .then(() => {
          setMessageHandler('Blog deleted', false)
          setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        })
        .catch((error) => {
          setMessageHandler('You don\'t have permission to delete this blog', true)
        })
    }
  }

  const blogForm = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </>
  )

  const errorNotification = () => {
    return (
      <div>
        { error && <div className='error'>{message}</div> }
        { !error && <div className='success'>{message}</div> }
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {message && errorNotification(error)}
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        {blogForm()}
      </div>

      }
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog}  
            ref={blogRef} 
            likeBlog={likeBlog} 
            removeBlog={removeBlog}
            user={user && user.username === blog.user.username}
          />
        )}
    </div>
  )
}

export default App
import { useState } from 'react'
import InputField from './InputField'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <InputField title="title" value={title} handleChange={event => setTitle(event.target.value)} />
        <InputField title="author" value={author} handleChange={event => setAuthor(event.target.value)} />
        <InputField title="url" value={url} handleChange={event => setUrl(event.target.value)} />

        <button id='submitBlogButton' type="submit">save</button>
      </form>
    </div>
  )
}


export default BlogForm
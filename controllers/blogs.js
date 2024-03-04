const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if (user === null) {
    response.status(401).json({ error: 'token invalid' })
  }

  const body = request.body
  if (!body.title || !body.url) {
    response.status(400).json({ error: 'missing fields' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (user === null) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  if ( blog.user._id.toString() === user._id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } else {
    response.status(401).json({ error: 'You don\'t have permission to delete' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newBlog = {}

  if (body.title) { newBlog.title = body.title }
  if (body.author) { newBlog.author = body.author }
  if (body.url) { newBlog.url = body.url }
  if (body.likes) { newBlog.likes = body.likes }

  const blog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  if (!blog) {
    return response.status(404).end()
  }
  response.status(202).json(blog)
})

module.exports = blogsRouter
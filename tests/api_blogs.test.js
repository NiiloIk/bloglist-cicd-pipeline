const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
const { initialBlogs, newBlog, blogsInDb, usersInDb, newUser } = require('./test_helper')

const login = async (username, password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  return response.body.token
}

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  await api.post('/api/users').send(newUser)
  const user = await User.findOne({ username: newUser.username })

  const updatedBlogs = initialBlogs.map(blog => ({ ...blog, user: user.id }))
  await Blog.insertMany(updatedBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('Returns the right amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('id field is id and not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
  describe('HTML POST tests', () => {
    test('adding a blog works', async () => {
      const token = await login(newUser.username, newUser.password)

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(201)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)


      const blogTitlesAtEnd = blogsAtEnd.map(blog => blog.title)
      expect(blogTitlesAtEnd).toContain(
        newBlog.title
      )
    })

    test('adding a blog without likes will set likes to zero', async () => {
      const token = await login(newUser.username, newUser.password)

      const blogWithoutLikes = {
        'title': 'This is a blog without likes',
        'author': newBlog.author,
        'url': newBlog.url
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(201)

      const blogInDb = await Blog.findOne({ 'title': blogWithoutLikes.title })
      expect(blogInDb.likes).toBe(0)
    })

    test('adding a blog with no title, returns HTML status 400', async () => {
      const token = await login(newUser.username, newUser.password)

      const blogWithoutTitle = {
        'author': newBlog.author,
        'url': newBlog.url,
        'likes': newBlog.likes
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(400)
    })

    test('adding a blog with no url, returns HTML status 400', async () => {
      const token = await login(newUser.username, newUser.password)
      const blogWithoutUrl = {
        'title': 'This is a blog that has no url',
        'author': newBlog.author,
        'likes': newBlog.likes
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(400)
    })

    test('adding a blog with no user authorization token, returns HTML status 401', async () => {
      await login(newUser.username, newUser.password)

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })
  describe('HTML DELETE tests', () => {
    test('deleting a blog lessens the amount of blogs and returns 204', async () => {
      const token = await login(newUser.username, newUser.password)
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ 'Authorization': `Bearer ${token}` })
        .expect(204)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        initialBlogs.length - 1
      )

      const authors = blogsAtEnd.map(r => r.author)
      expect(authors).not.toContain(blogToDelete.author)
    })
  })

  describe('HTML PUT tests', () => {
    test('updating a blogs likes returns 202', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToModify = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send({ 'likes': blogToModify.likes + 200 })
        .expect(202)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).not.toContain(blogToModify)
    })
    test('updating blogs information returns 202', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToModify = blogsAtStart[0]
      const modifiedBlog = {
        'title': 'new title',
        'author': 'Tuntematon Sotilas',
        'likes': 20,
        'url': 'http://notaworkingurl.com'
      }
      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(202)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).not.toContain(blogToModify)
    })
  })
})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with already existing username', async () => {

    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with too short password', async () => {

    const newUser = {
      username: 'MLuukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})



afterAll(async () => {
  await mongoose.connection.close()
})
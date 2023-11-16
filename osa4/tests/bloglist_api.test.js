const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // Testi jossa oletetaan blogien määrä olevan blogien määrä.
  test(`there are expected number blogs`, async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('should have "id" field defined', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  // Testi blogin lisäämiseen
  test('allow adding a blog', async () => {
    const user = await User.findOne({ username: 'root' })

    const newBlog = {
      title: "TestBlog",
      author: "1234",
      url: "http://localhost:3003/api/blogs",
      likes: 526,
      userId: user._id
    }

    const userResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = userResponse.body.token

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'TestBlog'
    )
  })

  test('Adding a blog with invalid token returns 401', async () => {
    const user = await User.findOne({ username: 'root' })

    const newBlog = {
      title: 'TestBlog',
      author: '1234',
      url: 'http://localhost:3003/api/blogs',
      likes: 526,
      userId: user._id,
    }

    const invalidToken = 'wrong'

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })


  //jos ei ole annettu likejä, liken oletuarvo on 0
  test('Set likes to 0 if not provived', async () => {
    const user = await User.findOne({ username: 'root' })

    const newBlog = {
      title: "TestBlg",
      author: "1234",
      url: "http://localhost:3003/api/b",
      userId: user._id
    }

    const userResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = userResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(r => r.likes)
    expect(contents).toContain(0)
  })

  // jos ei ole annettu url tai titlee, ei lisätä
  test('Blog without title or url is not added', async () => {
    const user = await User.findOne({ username: 'root' })

    const newBlog = {
      author: "1234",
      url: "http://localhost:3003/api/blogs",
      likes: 242,
      userId: user._id
    }

    const userResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = userResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  //poistaminen, testi menee läpi, jos käy laittamassa
  // test_helper.js tiedostossa olevaan testiin saman id:n kuin 
  // tietokannassa olevalla root käyttäjällä.
  // Ainakun testin ajaa uudelleen, niin root käyttäjän id muuttuu, koska luo uuden. 
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const userResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = userResponse.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

  //muokkaaminen
  test('a blog can be edited', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    const newBlog = {
      likes: 222
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map(r => r.likes)
    expect(contents).not.toContain(blogToEdit.likes)
  })

})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash, blogs: [] })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mulipmby',
      name: 'Paulus Muli',
      password: 'salainen',
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username lenght < 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username must be at least 3 chars long!')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password lenght < 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testi3',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must be at least 3 chars long!')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})




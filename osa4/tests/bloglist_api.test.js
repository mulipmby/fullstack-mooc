const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')


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
  test(`there are ${helper.initialBlogs.length}`, async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id field defined', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
  })

  // Testi blogin lisäämiseen
  test('Adding a blog', async () => {
    const newBlog = {
      title: "TestBlog",
      author: "1234",
      url: "http://localhost:3003/api/blogs",
      likes: 526
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'TestBlog'
    )
  })

  //jos ei ole annettu likejä, liken oletuarvo on 0
  test('Blog without likes, likes = 0', async () => {
    const newBlog = {
      title: "TestBlog",
      author: "1234",
      url: "http://localhost:3003/api/blogs",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(r => r.likes)


    expect(contents).toContain(0)

  })

  // jos ei ole annettu url tai titlee, ei lisätä
  test('Blog without title or url is not added', async () => {
    const newBlog = {
      author: "1234",
      url: "http://localhost:3003/api/blogs",
      likes: 242
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  //poistaminen
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

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

afterAll(async () => {
  await mongoose.connection.close()
})




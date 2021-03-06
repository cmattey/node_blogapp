const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper')
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog count is equal to initial length', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length);
})

test('validate that a blog can be added', async () => {
  const newBlog = {
    title: "Introduction to Algorithms",
    author: "CLRS",
    url: "https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844",
    likes: 1234
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length+1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain('Introduction to Algorithms')

})

afterAll(() => {
  mongoose.connection.close()
})

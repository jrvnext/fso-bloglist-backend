const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('users', { username: 1, name: 1})
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes,
    url: request.body.url,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toJSON() === user.id) {
    await Blog.remove(blog)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
  // falta eliminar la id del blog del array de posts del usuario
})

blogRouter.put('/:id', userExtractor, async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedBlog)
})

module.exports = blogRouter

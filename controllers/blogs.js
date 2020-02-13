const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {

  try{

    const blogs = await Blog.find({}).populate('user',{username:1, name:1, id:1});
    return response.json(blogs);

  } catch(exception) {
    console.log("Exception occured: ", exception)
  }

});

blogsRouter.post('/', async (request, response) => {

  try{

    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'});
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog(request.body);
    blog.user = user._id;

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);

  } catch(exception){
    console.log("Exception occured in token verification", exception)
  }
});

blogsRouter.delete('/:id', async (request, response) => {

  try{

    await Blog.findByIdAndRemove(request.params.id);
    return response.status(204).end();

  } catch(exception){
      console.log("Exception occured", exception)
  }
});

blogsRouter.put('/:id', async (request, response) => {
  try{
    const body = request.body;
    oldBlog = await Blog.findById(request.params.id).lean();

    const blog = {
      title: body.title ? body.title : oldBlog.title,
      author: body.author ? body.author : oldBlog.author,
      url: body.url ? body.url : oldBlog.url,
      likes: body.likes ? body.likes: oldBlog.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true});

    return response.json(updatedBlog);

  } catch(exception){
    console.log("Error occured: ", exception)
  }
})

module.exports = blogsRouter;

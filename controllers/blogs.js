const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {

  try{
    const blogs = await Blog.find({});
    return response.json(blogs);
  } catch(exception) {
    console.log("Exception occured: ", exception)
  }

});

blogsRouter.post('/', async (request, response) => {

  try{
    const blog = new Blog(request.body);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }catch(exception){
    console.log("Exception occured", exception)
  }
  // const blog = new Blog(request.body);
  //
  // blog
  //   .save()
  //   .then((result) => {
  //     response.status(201).json(result);
  //   });
});

module.exports = blogsRouter;

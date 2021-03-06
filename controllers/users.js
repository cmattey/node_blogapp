const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try{
      const body = request.body

      if(body.password.length<3){
        return response.status(400).json({"error":"Username and Password should be atleast 3 characters long"});
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username : body.username,
        name : body.name,
        passwordHash,
      })

      const savedUser = await user.save()

      return response.json(savedUser)

  } catch(exception){
    console.log("Excpetion occured: ", exception)
    return response.status(400).json({"error":"Username and Password should be atleast 3 characters long"});
  }
})

usersRouter.get('/', async (request, response) => {
  try{
      const users = await User.find({}).populate('blogs', {title:1, likes:1});
      return response.json(users.map(u => u.toJSON()));

  } catch(exception){
    console.log("Exception occured: ", exception)
  }
})

usersRouter.get('/:id', async (request, response) => {
  try{

    const user = await User.findById(request.params.id)

    return response.json(user)

  }catch(exception){
    console.log("Exception occured in users controller: ",exception)
  }
})

module.exports = usersRouter;

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try{

      const body = request.body

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
  }
})

module.exports = usersRouter;

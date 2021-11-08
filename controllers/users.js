const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, likes: 1, url: 1 })
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10)

  if(req.body.password.length < 3) {
    res
      .status(400)
      .json({
        "error": "password must be more than 3 characters long"
      })
  }

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    passwordHash
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = userRouter
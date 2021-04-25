const express = require('express')
const auth = require('../routes/auth')
const recipes = require('../routes/recipes')

module.exports = app => {
  app.use(express.json())
  app.use('/api/auth', auth)
  app.use('/api/recipes', recipes)
}

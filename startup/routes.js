const express = require('express')
const auth = require('../routes/auth')
const recipes = require('../routes/recipes')
const categories = require('../routes/categories')

module.exports = app => {
  app.use(express.json())
  app.use('/uploads', express.static(process.cwd() + '/uploads'))
  app.use('/api/auth', auth)
  app.use('/api/recipes', recipes)
  app.use('/api/categories', categories)
}

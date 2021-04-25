const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')

router.post('/', recipeController.addRecipe)
router.delete('/', recipeController.removeRecipe)

module.exports = router

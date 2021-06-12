const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getCategories)
router.post('/', categoryController.addCategory)
router.get('/recipes', categoryController.getAllCategoryRecipes)

module.exports = router

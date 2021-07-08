const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const multer = require('multer');
const fs = require('fs')
const { parseFileName } = require('../utils/helpers')
const authMiddleware = require('../middleware/auth')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `uploads/${parseFileName(req.body.title)}/`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage });

router.get('/', recipeController.getRecipes)
router.get('/getById', recipeController.getRecipeById)
router.post('/', authMiddleware, upload.fields([{ name: 'images' }, { name: 'coverImage' }]), recipeController.addRecipe)
router.delete('/', authMiddleware, recipeController.removeRecipe)

module.exports = router

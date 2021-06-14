const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `uploads/${req.body.title.split(' ').join('-').toLowerCase().toLowerCase()}/`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage });

router.get('/', recipeController.getRecipes)
router.post('/', upload.array('images'), recipeController.addRecipe)
router.delete('/', recipeController.removeRecipe)

module.exports = router

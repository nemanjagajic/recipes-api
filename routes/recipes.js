const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})
const upload = multer({ storage });

router.get('/', recipeController.getRecipes)
router.post('/', upload.single('image'), recipeController.addRecipe)
router.delete('/', recipeController.removeRecipe)

module.exports = router

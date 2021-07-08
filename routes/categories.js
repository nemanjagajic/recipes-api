const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
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

router.get('/', categoryController.getCategories)
router.post('/', authMiddleware, upload.single('image'), categoryController.addCategory)
router.get('/recipes', categoryController.getAllCategoryRecipes)

module.exports = router

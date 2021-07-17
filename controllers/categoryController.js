const { parseFileName } = require('../utils/helpers')
const { Category, validateCategory } = require('../models/category')
const { Recipe } = require('../models/recipe')
const fs = require('fs')
const sharp = require('sharp')

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ show: true });
    return res.send(categories);
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.addCategory = async (req, res) => {
  try {
    const { error } = validateCategory(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    const imageTempDestination = req.file
      ? `uploads/${parseFileName(req.body.title)}/${req.file.originalname}`
      : null
    const imageDestination = req.file
      ? `uploads/${parseFileName(req.body.title)}/resized_${req.file.originalname}`
      : null
    if (imageTempDestination) {
      await sharp(imageTempDestination)
        .jpeg({ quality: 90 })
        .toFile(
          imageDestination
        )
      fs.unlinkSync(imageTempDestination)
    }

    const parsedFileName = parseFileName(req.body.title)
    const category = new Category({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? `${parsedFileName}/resized_${req.file.filename}` : null,
      createdAt: new Date()
    })
    const addedCategory = await category.save()
    return res.send(addedCategory)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.getAllCategoryRecipes = async(req, res) => {
  try {
    const categoryId = req.query.categoryId
    const category = await Category.findById(categoryId)
    if (!category) return res.status(400).send({ message: `Category with the id ${categoryId} doesn't exist` })

    const allRecipes = await Recipe.find().sort({ createdAt: -1 })
    const filteredRecipes = allRecipes.filter(recipe => recipe.categories.includes(categoryId))
    return res.send(filteredRecipes)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.markCategoryAsDeleted = async(req, res) => {
  try {
    const categoryId = req.body.categoryId
    const category = await Category.findByIdAndUpdate(categoryId, { show: false })
    if (!category) return res.status(400).send({ message: `Category with the id ${categoryId} doesn't exist` })
    return res.send(category)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

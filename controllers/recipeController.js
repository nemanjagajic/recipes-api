const { Recipe, validateRecipe } = require('../models/recipe')
const { Category } = require('../models/category')
const { parseFileName } = require('../utils/helpers')

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    return res.send(recipes);
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.addRecipe = async (req, res) => {
  try {
    const { error } = validateRecipe(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    const categories = req.body.categories

    if (categories.length === 0) {
      return res.status(400).send({ message: 'Category must be selected' })
    }

    for (const categoryId of categories) {
      const foundCategory = await Category.findById(categoryId)
      if (!foundCategory) return res.status(400).send({ message: `Category with the id ${categoryId} doesn't exist` })
    }

    const parsedFileName = parseFileName(req.body.title)
    const coverImageName = req.files.coverImage?.length > 0 ? `${parsedFileName}/${req.files.coverImage[0].filename}` : null
    const imageNames = req.files.images?.map(
      file => `${parsedFileName}/${file.filename}`
    )

    const recipe = new Recipe({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      categories,
      coverImage: coverImageName,
      images: imageNames,
      createdAt: new Date()
    })
    const addedRecipe = await recipe.save()
    return res.send(addedRecipe)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.removeRecipe = async (req, res) => {
  try {
    const recipeId = req.body.recipeId
    const removedRecipe = await Recipe.findOneAndDelete({ _id: recipeId })
    if (!removedRecipe) return res.status(400).send({ message: `Recipe with the given id doesn't exist` })
    return res.send(removedRecipe)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

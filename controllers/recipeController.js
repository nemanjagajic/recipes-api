const { Recipe, validateRecipe } = require('../models/recipe')
const { Category } = require('../models/category')
const { parseFileName } = require('../utils/helpers')
const fs = require('fs')
const sharp = require('sharp');

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
    return res.send(recipes);
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.getRecipeById = async (req, res) => {
  try {
    const recipeId = req.query.recipeId
    const recipe = await Recipe.findOne({ _id: recipeId })
    if (!recipe) return res.status(400).send({ message: `Recipe with the given id doesn't exist` })
    return res.send(recipe)
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

    const categoryImageTempDestination = req.files.coverImage?.length > 0
      ? `uploads/${parseFileName(req.body.title)}/${req.files.coverImage[0].originalname}`
      : null
    const categoryImageDestination = req.files.coverImage?.length > 0
      ? `uploads/${parseFileName(req.body.title)}/resized_${req.files.coverImage[0].originalname}`
      : null
    if (categoryImageTempDestination) {
      await sharp(categoryImageTempDestination)
        .jpeg({ quality: 90 })
        .toFile(
          categoryImageDestination
        )
      fs.unlinkSync(categoryImageTempDestination)
    }

    if (req.files.length > 0) {
      for await (const image of req.files.images) {
        const tempDestination = `uploads/${parseFileName(req.body.title)}/${image.originalname}`
        const destination = `uploads/${parseFileName(req.body.title)}/resized_${image.originalname}`

        await sharp(tempDestination)
          .jpeg({quality: 90})
          .toFile(
            destination
          )
        fs.unlinkSync(tempDestination)
      }
    }

    const parsedFileName = parseFileName(req.body.title)
    const coverImageName = req.files.coverImage?.length > 0 ? `${parsedFileName}/resized_${req.files.coverImage[0].filename}` : null
    const imageNames = req.files.images?.map(
      file => `${parsedFileName}/resized_${file.filename}`
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
    const parsedFileName = parseFileName(removedRecipe.title)
    fs.rmdirSync(`uploads/${parsedFileName}`, { recursive: true });
    return res.send(removedRecipe)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

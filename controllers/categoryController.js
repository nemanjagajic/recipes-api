const { Category, validateCategory } = require('../models/category')
const { Recipe } = require('../models/recipe')

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

exports.addCategory = async (req, res) => {
  try {
    const { error } = validateCategory(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    const category = new Category({
      title: req.body.title,
      description: req.body.description,
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

    const allRecipes = await Recipe.find()
    const filteredRecipes = allRecipes.filter(recipe => recipe.categories.includes(categoryId))
    return res.send(filteredRecipes)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}

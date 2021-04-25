const { Recipe, validateRecipe } = require('../models/recipe')

exports.addRecipe = async (req, res) => {
  try {
    const { error } = validateRecipe(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    const recipe = new Recipe({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      description: req.body.description
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

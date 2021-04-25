const mongoose = require('mongoose')
const Joi = require('joi')

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: false,
    default: null
  }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

function validateRecipe(user) {
  const schema = {
    title: Joi.string()
      .required(),
    shortDescription: Joi.string()
      .required(),
    description: Joi.string()
      .required()
  }

  return Joi.validate(user, schema)
}

exports.Recipe = Recipe
exports.validateRecipe = validateRecipe

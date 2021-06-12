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
  },
  categories: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true
  }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

function validateRecipe(recipe) {
  const schema = {
    title: Joi.string()
      .required(),
    shortDescription: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    categories: Joi.array()
      .required()
  }

  return Joi.validate(recipe, schema)
}

exports.Recipe = Recipe
exports.validateRecipe = validateRecipe

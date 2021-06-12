const mongoose = require('mongoose')
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
})

const Category = mongoose.model('Category', categorySchema)

function validateCategory(category) {
  const schema = {
    title: Joi.string()
      .required(),
    description: Joi.string()
  }

  return Joi.validate(category, schema)
}

exports.Category = Category
exports.validateCategory = validateCategory

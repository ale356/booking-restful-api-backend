/**
 * Mongoose model Email.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure the email value is unique
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    maxlength: [255, 'Email address cannot exceed 255 characters'] // Maximum length of 255 characters.
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

// Define virtual 'id' field on the schema
schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Email = mongoose.model('Email', schema)

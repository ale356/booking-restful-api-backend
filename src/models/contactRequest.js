/**
 * Mongoose model ContactRequest.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  email: {
    type: String,
    required: true,
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
export const ContactRequest = mongoose.model('ContactRequest', schema)

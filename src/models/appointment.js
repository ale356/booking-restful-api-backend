/**
 * Mongoose model Appointment.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Calculate the maximum date (2 years from now).
const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() + 2)

// Create a schema.
const schema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  time: {
    type: Date,
    required: true,
    min: [new Date(), 'Appointment time must be in the future'], // Minimum value is the current date/time.
    max: [maxDate, 'Appointment time cannot exceed 2 years from now'] // Maximum value is 2 years from now.
  },
  firstName: {
    type: String,
    required: true,
    minlength: [2, 'First name must be at least 2 characters'], // Minimum length of 2 characters.
    maxlength: [50, 'First name cannot exceed 50 characters'] // Maximum length of 50 characters.
  },
  lastName: {
    type: String,
    required: true,
    minlength: [2, 'Last name must be at least 2 characters'], // Minimum length of 2 characters.
    maxlength: [50, 'Last name cannot exceed 50 characters'] // Maximum length of 50 characters.
  },
  mobileNumber: {
    type: String,
    required: true,
    minlength: [4, 'Mobile number must be at least 4 characters'], // Minimum length of 4 characters.
    maxlength: [15, 'Mobile number cannot exceed 15 characters'] // Maximum length of 15 characters.
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
export const Appointment = mongoose.model('Appointment', schema)

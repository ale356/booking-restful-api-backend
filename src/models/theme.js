/**
 * Mongoose model Theme.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  palette: {
    primary: {
      main: {
        type: String,
        required: true,
        validate: {
          /**
           * Makes sure the value is a hexadecimal color code.
           *
           * @param {string} value - The hexadecimal color value.
           * @returns {boolean} True if value is valid.
           */
          validator: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
          message: 'Invalid color format. Please use hexadecimal color codes (#RRGGBB)'
        }
      }
    },
    secondary: {
      main: {
        type: String,
        required: true,
        validate: {
          /**
           * Makes sure the value is a hexadecimal color code.
           *
           * @param {string} value - The hexadecimal color value.
           * @returns {boolean} True if value is valid.
           */
          validator: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
          message: 'Invalid color format. Please use hexadecimal color codes (#RRGGBB)'
        }
      }
    },
    error: {
      main: {
        type: String,
        required: true,
        validate: {
          /**
           * Makes sure the value is a hexadecimal color code.
           *
           * @param {string} value - The hexadecimal color value.
           * @returns {boolean} True if value is valid.
           */
          validator: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
          message: 'Invalid color format. Please use hexadecimal color codes (#RRGGBB)'
        }
      }
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

/**
 * Creates a theme object if it does not exist.
 */
schema.statics.createThemeIfNotExists = async function () {
  const existingTheme = await this.findOne()
  if (!existingTheme) {
    const theme = new this({
      palette: {
        primary: {
          main: '#2196f3' // Default primary color
        },
        secondary: {
          main: '#4caf50' // Default secondary color
        },
        error: {
          main: '#f44336' // Default error color
        }
      }
    })
    await theme.save()
    console.log('Theme object created successfully.')
  } else {
    console.log('Theme object already exists.')
  }
}

// Create a model using the schema.
export const Theme = mongoose.model('Theme', schema)

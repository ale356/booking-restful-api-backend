/**
 * Module for the ThemeController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import createError from 'http-errors'
import { Theme } from '../../models/theme.js'

/**
 * Encapsulates a controller.
 */
export class ThemeController {
  /**
   * Sends a JSON response containing the theme.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findOne(req, res, next) {
    try {
      const theme = await Theme.findOne()

      res.json(theme)
    } catch (error) {
      next(error)
    }
  }

  /**
 * Updates the theme.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async update(req, res, next) {
    try {

      // The object to send in to findOneAndUpdate.
      const update = req.body

      // Search upp the theme document in the database and update it.
      await Theme.findOneAndUpdate({}, update, {
        new: true
      })

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Module for the EmailsController.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Email } from '../../models/email.js'

/**
 * Encapsulates a controller.
 */
export class EmailsController {
  /**
   * Provide req.email to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the email to load.
   */
  async loadEmail (req, res, next, id) {
    try {
      // Get the email.
      const email = await Email.findById(id)

      // If no email found send a 404 (Not Found).
      if (!email) {
        next(createError(404))
        return
      }

      // Provide the email to the req.
      req.email = email

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.email)
  }

  /**
   * Sends a JSON response containing all emails.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const emails = await Email.find()

      res.json(emails)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const email = new Email({
        email: req.body.email
      })

      await email.save()

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${email._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(email)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      // Get the email id parameter from the url.
      const emailId = req.params.id

      // The object to send in to findOneAndUpdate.
      const filter = { _id: emailId }
      const update = req.body

      // Search upp the email document in the database and update it.
      await Email.findOneAndUpdate(filter, update, {
        new: true
      })

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the specified email.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await req.email.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}

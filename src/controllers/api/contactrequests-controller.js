/**
 * Module for the ContactRequestsController.
 *
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import createError from 'http-errors'
import { ContactRequest } from '../../models/contactRequest.js'

/**
 * Encapsulates a controller.
 */
export class ContactRequestsController {
  /**
   * Provide req.contactRequest to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the contactRequest to load.
   */
  async loadContactRequest (req, res, next, id) {
    try {
      // Get the contactRequest.
      const contactRequest = await ContactRequest.findById(id)

      // If no contact request found send a 404 (Not Found).
      if (!contactRequest) {
        next(createError(404))
        return
      }

      // Provide the contactRequest to the req.
      req.contactRequest = contactRequest

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a contactRequest.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.contactRequest)
  }

  /**
   * Sends a JSON response containing all contactRequests.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const contactRequests = await ContactRequest.find()

      res.json(contactRequests)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new contactRequest.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const contactRequest = new ContactRequest({
        message: req.body.message,
        email: req.body.email
      })

      await contactRequest.save()

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${contactRequest._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(contactRequest)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific contactRequest.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      // Get the contactRequest id parameter from the url.
      const contactRequestId = req.params.id

      // The object to send in to findOneAndUpdate.
      const filter = { _id: contactRequestId }
      const update = req.body

      // Search upp the contactRequest document in the database and update it.
      await ContactRequest.findOneAndUpdate(filter, update, {
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
   * Deletes the specified contactRequest.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await req.contactRequest.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Module for the ServicesController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import createError from 'http-errors'
import { Service } from '../../models/service.js'

/**
 * Encapsulates a controller.
 */
export class ServicesController {
  /**
   * Provide req.service to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the service to load.
   */
  async loadService (req, res, next, id) {
    try {
      // Get the service.
      const service = await Service.findById(id)

      // If no service found send a 404 (Not Found).
      if (!service) {
        next(createError(404))
        return
      }

      // Provide the service to req.
      req.service = service

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.service)
  }

  /**
   * Sends a JSON response containing all services.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const services = await Service.find()

      res.json(services)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        durationInMinutes: req.body.durationInMinutes
      })

      await service.save()

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${service._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(service)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      // Get the service id parameter from the url.
      const serviceId = req.params.id

      // The object to send in to findOneAndUpdate.
      const filter = { _id: serviceId }
      const update = req.body

      // Search upp the service document in the database and update it.
      await Service.findOneAndUpdate(filter, update, {
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
   * Deletes the specified service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await req.service.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}

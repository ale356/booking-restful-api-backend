/**
 * Module for the AppointmentsController.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import createError from 'http-errors'
import { Appointment } from '../../models/appointment.js'

/**
 * Encapsulates a controller.
 */
export class AppointmentsController {
  /**
   * Provide req.appointment to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the appointment to load.
   */
  async loadAppointment(req, res, next, id) {
    try {
      // Get the appointment.
      const appointment = await Appointment.findById(id)

      // If no appointment found send a 404 (Not Found).
      if (!appointment) {
        next(createError(404))
        return
      }

      // Provide the appointment to the req.
      req.appointment = appointment

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a appointment.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find(req, res, next) {
    res.json(req.appointment)
  }

  /**
   * Sends a JSON response containing all appointments.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll(req, res, next) {
    try {
      const appointments = await Appointment.find()

      res.json(appointments)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new appointment.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create(req, res, next) {
    try {
      const appointment = new Appointment({
        serviceId: req.body.serviceId,
        time: req.body.time,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email
      })

      await appointment.save()

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${appointment._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(appointment)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific appointment.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update(req, res, next) {
    try {
      // Get the appointment id parameter from the url.
      const appointmentId = req.params.id

      // The object to send in to findOneAndUpdate.
      const filter = { _id: appointmentId }
      const update = req.body

      // Search upp the appointment document in the database and update it.
      await Appointment.findOneAndUpdate(filter, update, {
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
   * Deletes the specified appointment.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req, res, next) {
    try {
      await req.appointment.deleteOne()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}

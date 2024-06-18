/**
 * API version 1 routes.
 *
 * @author Mats Loock
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { ThemeController } from '../../../controllers/api/theme-controller.js'

export const router = express.Router()

const controller = new ThemeController()

// ------------------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------------------

const PermissionLevels = Object.freeze({
  READ: 1,
  CREATE: 2,
  UPDATE: 4,
  DELETE: 8
})

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = {
      username: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      permissionLevel: payload.x_permission_level
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

/**
 * Authorize requests.
 *
 * If authorization is successful, that is the user is granted access
 * to the requested resource, the request is authorized to continue.
 * If authentication fails, a forbidden response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {number} permissionLevel - ...
 */
const hasPermission = (req, res, next, permissionLevel) => {
  req.user?.permissionLevel & permissionLevel
    ? next()
    : next(createError(403))
}

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

// GET theme
router.get('/', (req, res, next) => controller.findOne(req, res, next))

// PUT theme
router.put('/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.UPDATE),
  (req, res, next) => controller.update(req, res, next)
)

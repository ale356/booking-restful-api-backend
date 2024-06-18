/**
 * API version 1 routes.
 *
 * @author Mats Loock
 * @author Alejandro Lindström Mamani
 * @version 1.0.0
 */

import express from 'express'
import { router as accountRouter } from './account-router.js'
import { router as appointmentsRouter } from './appointments-router.js'
import { router as usersRouter } from './users-router.js'
import { router as servicesRouter } from './services-router.js'
import { router as themeRouter } from './theme-router.js'
import { router as emailRouter } from './emails-router.js'
import { router as contactRequestRouter } from './contactrequests-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/', accountRouter)
router.use('/appointments', appointmentsRouter)
router.use('/users', usersRouter)
router.use('/services', servicesRouter)
router.use('/theme', themeRouter)
router.use('/emails', emailRouter)
router.use('/contactRequests', contactRequestRouter)

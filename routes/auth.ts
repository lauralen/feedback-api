import express from 'express'
import controller from '../controllers/auth'
import { protect } from '../middleware/auth'
// import User, { UserType } from '../models/User'

const router = express.Router()

router.route('/register').post(controller.registerUser)
router.route('/login').post(controller.login)
router.route('/me').get(protect, controller.getLoggedInUserViaToken)

export = router

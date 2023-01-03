import express from 'express'
import controller from '../controllers/auth'
// import User, { UserType } from '../models/User'

const router = express.Router()

router.route('/register').post(controller.registerUser)

export = router

import express from 'express'

import controller from '../controllers/users'
import advancedResults from '../middleware/advancedResults'
import User, { UserModelType } from '../models/User'

const router = express.Router()

router.route('/').get(advancedResults<UserModelType>(User), controller.getUsers)
router.route('/:id').get(controller.getUser)

export = router

import express from 'express'

import controller from '../controllers/feedbacks'
import advancedResults from '../middleware/advancedResults'
import { protect } from '../middleware/auth'
import Feedback, { FeedbackType } from '../models/Feedback'

import commentsRouter from './comments'

const router = express.Router()

router.use('/:feedbackId/comments', commentsRouter)

router
	.route('/')
	.get(
		advancedResults<FeedbackType>(Feedback, 'comments'),
		controller.getFeedbacks
	)
	.post(protect, controller.createFeedback)
router
	.route('/:id')
	.get(controller.getFeedback)
	.put(protect, controller.updateFeedback)
	.delete(protect, controller.deleteFeedback)

export = router

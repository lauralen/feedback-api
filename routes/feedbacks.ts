import express from 'express'
import controller from '../controllers/feedbacks'
import advancedResults from '../middleware/advancedResults'
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
	.post(controller.createFeedback)
router
	.route('/:id')
	.get(controller.getFeedback)
	.put(controller.updateFeedback)
	.delete(controller.deleteFeedback)

export = router

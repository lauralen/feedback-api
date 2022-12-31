import express from 'express'
import controller from '../controllers/feedbacks'
import commentsRouter from './comments'

const router = express.Router()

router.use('/:feedbackId/comments', commentsRouter)

router.route('/').get(controller.getFeedbacks).post(controller.createFeedback)
router
	.route('/:id')
	.get(controller.getFeedback)
	.put(controller.updateFeedback)
	.delete(controller.deleteFeedback)

export = router

import express from 'express'
import controller from '../controllers/comments'

const router = express.Router()

router.route('/').post(controller.createComment)
// .get(controller.getFeedbacks)
// router
// 	.route('/:id')
// 	.get(controller.getFeedback)
// 	.put(controller.updateFeedback)
// 	.delete(controller.deleteFeedback)

export = router

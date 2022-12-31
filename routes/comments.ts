import express from 'express'
import controller from '../controllers/comments'

const router = express.Router({ mergeParams: true })

router.route('/').get(controller.getComments).post(controller.createComment)
// router
// 	.route('/:id')
// 	.get(controller.getFeedback)
// 	.put(controller.updateFeedback)
// 	.delete(controller.deleteFeedback)

export = router

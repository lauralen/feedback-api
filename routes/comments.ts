import express from 'express'

import controller from '../controllers/comments'
import advancedResults from '../middleware/advancedResults'
import { protect } from '../middleware/auth'
import Comment, { CommentModelType } from '../models/Comment'

const router = express.Router({ mergeParams: true })

router
	.route('/')
	.get(advancedResults<CommentModelType>(Comment), controller.getComments)
	.post(protect, controller.createComment)
router
	.route('/:id')
	.get(controller.getComment)
	.put(protect, controller.updateComment)
	.delete(protect, controller.deleteComment)

export = router

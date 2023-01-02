import express from 'express'

import controller from '../controllers/comments'
import advancedResults from '../middleware/advancedResults'
import Comment, { CommentType } from '../models/Comment'

const router = express.Router({ mergeParams: true })

router
	.route('/')
	.get(advancedResults<CommentType>(Comment), controller.getComments)
	.post(controller.createComment)
router
	.route('/:id')
	.get(controller.getComment)
	.put(controller.updateComment)
	.delete(controller.deleteComment)

export = router

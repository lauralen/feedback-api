import { Request, Response } from 'express'

import Comment from '../models/Comment'
import asyncHandler from '../middleware/async'

const getComments = asyncHandler(async (req: Request, res: Response) => {
	let query

	if (req.params.feedbackId) {
		query = Comment.find({ feedback: req.params.feedbackId })
	} else {
		query = Comment.find()
	}

	const courses = await query

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	})
})

const createComment = asyncHandler(async (req: Request, res: Response) => {
	const comment = await Comment.create(req.body)
	res.status(201).json({ success: true, data: comment })
})

export default { getComments, createComment }

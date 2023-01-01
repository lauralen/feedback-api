import { NextFunction, Request, Response } from 'express'

import Comment from '../models/Comment'
import asyncHandler from '../middleware/async'
import ErrorResponse from '../utils/errorResponse'

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

const getComment = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const comment = await Comment.findById(req.params.id).populate({
			path: 'feedback',
			select: 'title',
		})

		if (!comment) {
			return next(
				new ErrorResponse(
					`Comment not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({
			success: true,
			data: comment,
		})
	}
)

const createComment = asyncHandler(async (req: Request, res: Response) => {
	const comment = await Comment.create(req.body)
	res.status(201).json({ success: true, data: comment })
})

export default { getComments, getComment, createComment }

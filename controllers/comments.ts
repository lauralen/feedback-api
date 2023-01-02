import { NextFunction, Request, Response } from 'express'

import Comment from '../models/Comment'
import Feedback from '../models/Feedback'
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

const createComment = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		req.body.feedback = req.params.feedbackId

		const feedback = await Feedback.findById(req.params.feedbackId)

		if (!feedback) {
			return next(
				new ErrorResponse(
					`Feedback not found with id of ${req.params.feedbackId}`,
					404
				)
			)
		}

		const comment = await Comment.create(req.body)
		res.status(201).json({ success: true, data: comment })
	}
)

const updateComment = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let comment = await Comment.findById(req.params.id)

		if (!comment) {
			return next(
				new ErrorResponse(
					`Comment not found with id of ${req.params.id}`,
					404
				)
			)
		}

		comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // get updated data in response
			runValidators: true,
		})

		res.status(200).json({ success: true, data: comment })
	}
)

export default { getComments, getComment, createComment, updateComment }

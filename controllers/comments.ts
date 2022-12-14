import { NextFunction, Request, Response } from 'express'

import Comment from '../models/Comment'
import Feedback from '../models/Feedback'
import asyncHandler from '../middleware/async'
import ErrorResponse from '../utils/errorResponse'
import { AdvancedResultsResponse } from '../middleware/advancedResults'

const getComments = asyncHandler(
	async (req: Request, res: AdvancedResultsResponse) => {
		if (req.params.feedbackId) {
			const comments = await Comment.find({
				feedback: req.params.feedbackId,
			})

			res.status(200).json({
				success: true,
				count: comments.length,
				data: comments,
			})
		} else {
			res.status(200).json(res.advancedResults)
		}
	}
)

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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		req.body.user = req.user.id

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

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const { id: userId, role: userRole } = req.user

		// check if user is feedback creator or admin
		if (comment.user.toString() !== userId && userRole !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${userId} is not authorized to update this comment`,
					401
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

const deleteComment = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const comment = await Comment.findById(req.params.id)

		if (!comment) {
			return next(
				new ErrorResponse(
					`Comment not found with id of ${req.params.id}`,
					404
				)
			)
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const { id: userId, role: userRole } = req.user

		// check if user is feedback creator or admin
		if (comment.user.toString() !== userId && userRole !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${userId} is not authorized to delete this comment`,
					401
				)
			)
		}

		// instead of findByIdAndDelete so delete comments middleware works
		comment.remove()

		res.status(200).json({ success: true, data: {} })
	}
)

export default {
	getComments,
	getComment,
	createComment,
	updateComment,
	deleteComment,
}

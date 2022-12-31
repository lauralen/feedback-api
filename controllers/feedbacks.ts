import { NextFunction, Request, Response } from 'express'

import Feedback from '../models/Feedback'
import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'

// TODO: filters
// - category
// - status
const getFeedbacks = asyncHandler(async (req: Request, res: Response) => {
	const requestQuery = { ...req.query }
	const removeFields = ['select', 'sort', 'page', 'limit']

	removeFields.forEach((param) => delete requestQuery[param])

	const queryString = JSON.stringify(requestQuery).replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	)
	let query
	query = Feedback.find(JSON.parse(queryString)).populate('comments')

	if (req.query.select) {
		// TODO: fix type casting by strongly typing RequestHandler
		const select = req.query.select as string
		const fields = select.split(',').join(' ')
		query = query.select(fields)
	}

	if (req.query.sort) {
		// TODO: fix type casting by strongly typing RequestHandler
		const sort = req.query.sort as string
		const sortBy = sort.split(',').join(' ')
		query = query.sort(sortBy)
	} else {
		query = query.sort('-createdAt')
	}

	// TODO: fix type casting by strongly typing RequestHandler
	const page = parseInt(req.query.page as string, 10) || 1
	const limit = parseInt(req.query.limit as string, 10) || 100
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Feedback.countDocuments()

	query = query.skip(startIndex).limit(limit)

	const feedbacks = await query

	const pagination: {
		next?: { page: number; limit: number }
		previous?: { page: number; limit: number }
	} = {}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		}
	}

	if (startIndex > 0) {
		pagination.previous = {
			page: page - 1,
			limit,
		}
	}

	res.status(200).json({
		success: true,
		count: feedbacks.length,
		pagination,
		data: feedbacks,
	})
})

const getFeedback = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const feedback = await Feedback.findById(req.params.id)

		// when id has valid format but doesn't exist existent in db
		// fix returning { success: true, data: null }
		if (!feedback) {
			return next(
				new ErrorResponse(
					`Feedback not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: feedback })
	}
)

const createFeedback = asyncHandler(async (req: Request, res: Response) => {
	const feedback = await Feedback.create(req.body)
	res.status(201).json({ success: true, data: feedback })
})

const updateFeedback = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const feedback = await Feedback.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // get updated data in response
				runValidators: true,
			}
		)

		if (!feedback) {
			return next(
				new ErrorResponse(
					`Feedback not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: feedback })
	}
)

const deleteFeedback = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const feedback = await Feedback.findByIdAndDelete(req.params.id)

		if (!feedback) {
			return next(
				new ErrorResponse(
					`Feedback not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: {} })
	}
)

export default {
	getFeedbacks,
	getFeedback,
	createFeedback,
	updateFeedback,
	deleteFeedback,
}

import { NextFunction, Request, Response } from 'express'

import Feedback from '../models/Feedback'
import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'
import { AdvancedResultsResponse } from '../middleware/advancedResults'

const getFeedbacks = asyncHandler(
	async (req: Request, res: AdvancedResultsResponse) => {
		res.status(200).json(res.advancedResults)
	}
)

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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	req.body.user = req.user.id

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

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const { id: userId, role: userRole } = req.user

		// check if user is feedback creator or admin
		if (feedback.user.toString() !== userId && userRole !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${userId} is not authorized to update this feedback`,
					401
				)
			)
		}

		res.status(200).json({ success: true, data: feedback })
	}
)

const deleteFeedback = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const feedback = await Feedback.findById(req.params.id)

		if (!feedback) {
			return next(
				new ErrorResponse(
					`Feedback not found with id of ${req.params.id}`,
					404
				)
			)
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const { id: userId, role: userRole } = req.user

		// check if user is feedback creator or admin
		if (feedback.user.toString() !== userId && userRole !== 'admin') {
			return next(
				new ErrorResponse(
					`User ${userId} is not authorized to delete this feedback`,
					401
				)
			)
		}

		// instead of findByIdAndDelete so delete comments middleware works
		feedback.remove()

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

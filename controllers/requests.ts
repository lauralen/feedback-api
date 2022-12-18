import { NextFunction, Request, Response } from 'express'

import RequestModel from '../models/Request'
import ErrorResponse from '../utils/errorResponse'
import asyncHandler from '../middleware/async'

const getRequests = asyncHandler(async (req: Request, res: Response) => {
	const requests = await RequestModel.find()

	res.status(200).json({
		success: true,
		count: requests.length,
		data: requests,
	})
})

const getRequest = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const request = await RequestModel.findById(req.params.id)

		// when id has valid format but doesn't exist existent in db
		// fix returning { success: true, data: null }
		if (!request) {
			return next(
				new ErrorResponse(
					`Request not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: request })
	}
)

const createRequest = asyncHandler(async (req: Request, res: Response) => {
	const request = await RequestModel.create(req.body)
	res.status(201).json({ success: true, data: request })
})

const updateRequest = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const request = await RequestModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // get updated data in response
				runValidators: true,
			}
		)

		if (!request) {
			return next(
				new ErrorResponse(
					`Request not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: request })
	}
)

const deleteRequest = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const request = await RequestModel.findByIdAndDelete(req.params.id)

		if (!request) {
			return next(
				new ErrorResponse(
					`Request not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: {} })
	}
)

export default {
	getRequests,
	getRequest,
	createRequest,
	updateRequest,
	deleteRequest,
}

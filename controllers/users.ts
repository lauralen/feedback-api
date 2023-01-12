import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import asyncHandler from '../middleware/async'
import { AdvancedResultsResponse } from '../middleware/advancedResults'
import ErrorResponse from '../utils/errorResponse'

const getUsers = asyncHandler(
	async (req: Request, res: AdvancedResultsResponse) => {
		res.status(200).json(res.advancedResults)
	}
)

const getUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.id)

		// when id has valid format but doesn't exist existent in db
		// fix returning { success: true, data: null }
		if (!user) {
			return next(
				new ErrorResponse(
					`User not found with id of ${req.params.id}`,
					404
				)
			)
		}

		res.status(200).json({ success: true, data: user })
	}
)

const createUser = asyncHandler(async (req: Request, res: Response) => {
	const user = await User.create(req.body)
	res.status(201).json({ success: true, data: user })
})

export default { getUsers, getUser, createUser }

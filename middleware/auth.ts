import jwt from 'jsonwebtoken'

import asyncHandler from './async'
import ErrorResponse from '../utils/errorResponse'
import User from '../models/User'

export const protect = asyncHandler(async (req, res, next) => {
	let token: string | undefined

	if (
		req.headers.authorization &&
		req.headers.authorization?.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	}

	// TODO: implement
	// else if(req.cookies.token) {
	//   token = req.cookies.token
	// }

	if (!token) {
		return next(
			new ErrorResponse('Not authorized to access this route', 401)
		)
	}

	try {
		if (process.env.JWT_SECRET) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			req.user = await User.findById(decoded.id)
			next()
		}
	} catch (error) {
		return next(
			new ErrorResponse('Not authorized to access this route', 401)
		)
	}
})

import { NextFunction, Request, Response } from 'express'

import User from '../models/User'
import asyncHandler from '../middleware/async'
import ErrorResponse from '../utils/errorResponse'

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, role } = req.body

	const user = await User.create({ name, email, password, role })
	sendTokenResponse(user, 200, res)
})

const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body

		// validate as we're not using the User model
		if (!email || !password) {
			return next(
				new ErrorResponse(
					'Please provide an email and password',
					400
				)
			)
		}

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}

		// TODO: fix
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const doesPasswordMatch = await user.matchPassword(password)

		if (!doesPasswordMatch) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}

		sendTokenResponse(user, 200, res)
	}
)

const sendTokenResponse = (
	// TODO: strongly type user
	user: unknown,
	statusCode: number,
	res: Response
) => {
	if (process.env.JWT_COOKIE_EXPIRE) {
		// TODO: fix
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const token = user.getSignedJwtToken()
		const options = {
			expires: new Date(
				Date.now() +
					Number(process.env.JWT_COOKIE_EXPIRE) *
						24 *
						60 *
						60 *
						1000
			),
			httpOnly: true,
			secure: false,
		}

		if (process.env.NODE_ENV === 'production') {
			options.secure = true
		}

		res.status(statusCode)
			.cookie('token', token, options)
			.json({ success: true, token })
	}
}

const getLoggedInUserViaToken = asyncHandler(
	async (req: Request, res: Response) => {
		// TODO: fix type
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const user = await User.findById(req.user.id)

		res.status(200).json({ data: user })
	}
)

export default {
	registerUser,
	login,
	getLoggedInUserViaToken,
}

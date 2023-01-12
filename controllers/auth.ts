import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'

import User, { UserModelType, UserType } from '../models/User'
import asyncHandler from '../middleware/async'
import ErrorResponse from '../utils/errorResponse'
import sendEmail from '../utils/sendEmail'

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

		const doesPasswordMatch = await user.matchPassword(password)

		if (!doesPasswordMatch) {
			return next(new ErrorResponse('Invalid credentials', 401))
		}

		sendTokenResponse(user, 200, res)
	}
)

const getLoggedInUserViaToken = asyncHandler(
	// TODO: make user non optional
	async (req: Request & { user?: UserType }, res: Response) => {
		const user = await User.findById(req.user?.id)

		res.status(200).json({ data: user })
	}
)

const forgotPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findOne({ email: req.body.email })

		if (!user) {
			return next(new ErrorResponse('No user with email found', 404))
		}

		const resetToken = user.getResetPasswordToken()

		await user.save({ validateBeforeSave: false })

		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/reset-password/${resetToken}`
		const message = `TO reset password, make PUT request to ${resetUrl}`

		try {
			await sendEmail({
				email: user.email,
				subject: 'Password reset token',
				message,
			})

			res.status(200).json({ success: true, data: 'Email sent' })
		} catch (error) {
			console.log(error)

			user.resetPasswordToken = undefined
			user.resetPasswordExpire = undefined

			await user.save({ validateBeforeSave: false })

			return next(new ErrorResponse('Email could not be sent', 500))
		}

		res.status(200).json({ data: user })
	}
)

const resetPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(req.params.resetToken)
			.digest('hex')
		const user = await User.findOne({
			resetPasswordToken,
			// make sure it's greater than now
			resetPasswordExpire: { $gt: Date.now() },
		})

		if (!user) {
			return next(new ErrorResponse('Invalid token', 400))
		}

		user.password = req.body.password
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined
		await user.save()

		sendTokenResponse(user, 200, res)
	}
)

const updateUserDetails = asyncHandler(
	// TODO: make user non optional
	async (req: Request & { user?: UserType }, res: Response) => {
		const fieldsToUpdate = {
			name: req.body.name,
			email: req.body.email,
		}
		const user = await User.findByIdAndUpdate(
			req.user?.id,
			fieldsToUpdate,
			{
				new: true,
				runValidators: true,
			}
		)

		res.status(200).json({ data: user })
	}
)

const sendTokenResponse = (
	user: UserModelType,
	statusCode: number,
	res: Response
) => {
	if (process.env.JWT_COOKIE_EXPIRE) {
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

export default {
	registerUser,
	login,
	getLoggedInUserViaToken,
	forgotPassword,
	resetPassword,
	updateUserDetails,
}

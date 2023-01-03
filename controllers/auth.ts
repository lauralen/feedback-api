import { Request, Response } from 'express'

import User from '../models/User'
import asyncHandler from '../middleware/async'

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, role } = req.body

	const user = await User.create({ name, email, password, role })
	// TODO: fix
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const token = user.getSignedJwtToken()

	res.status(201).json({ success: true, token })
})

export default {
	registerUser,
}

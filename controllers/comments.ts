import { Request, Response } from 'express'

import Comment from '../models/Comment'
import asyncHandler from '../middleware/async'

const createComment = asyncHandler(async (req: Request, res: Response) => {
	const comment = await Comment.create(req.body)
	res.status(201).json({ success: true, data: comment })
})

export default {
	createComment,
}

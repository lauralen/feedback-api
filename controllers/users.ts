import { Request } from 'express'

import asyncHandler from '../middleware/async'
import { AdvancedResultsResponse } from '../middleware/advancedResults'

const getUsers = asyncHandler(
	async (req: Request, res: AdvancedResultsResponse) => {
		res.status(200).json(res.advancedResults)
	}
)

export default { getUsers }

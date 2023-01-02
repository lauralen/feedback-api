import { NextFunction, Request, Response } from 'express'
import { Model } from 'mongoose'

const advancedResults =
	<T>(model: Model<T>, populate?: string) =>
		async (req: Request, res: Response, next: NextFunction) => {
			const requestQuery = { ...req.query }
			const removeFields = ['select', 'sort', 'page', 'limit']

			removeFields.forEach((param) => delete requestQuery[param])

			const queryString = JSON.stringify(requestQuery).replace(
				/\b(gt|gte|lt|lte|in)\b/g,
				(match) => `$${match}`
			)
			let query
			query = model.find(JSON.parse(queryString))

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
			const total = await model.countDocuments()

			query = query.skip(startIndex).limit(limit)

			if (populate) {
				query = query.populate(populate)
			}

			const results = await query

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

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			res.advancedResults = {
				success: true,
				count: results.length,
				pagination,
				data: results,
			}

			next()
		}

export default advancedResults

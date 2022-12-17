import { NextFunction, Request, Response } from 'express'

import RequestModel from '../models/Request'
import ErrorResponse from '../utils/errorResponse'

const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await RequestModel.find()
    
    res.status(200).json({ success: true, count: requests.length, data: requests })
  } catch (error) {
    next(error)
  }
}

const getRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findById(req.params.id)

    // when id has valid format but doesn't exist existent in db
    // fix returning { success: true, data: null }
    if (!request) {
      return next(new ErrorResponse(`Request not found with id of ${req.params.id}`, 404))
    }
    
    res.status(200).json({ success: true, data: request })
  } catch (error) {
    next(error)
  }
}

const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.create(req.body)
    res.status(201).json({ success: true, data: request })
  } catch (error) {
    next(error)
  }
}

const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // get updated data in response
      runValidators: true
    })

    if (!request) {
      return next(new ErrorResponse(`Request not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: request })
  } catch (error) {
    next(error)
  }
}

const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findByIdAndDelete(req.params.id)

    if (!request) {
      return next(new ErrorResponse(`Request not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}

export default {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
}

import { Request, Response } from 'express'
import RequestModel from '../models/Request'

const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find()
    
    res.status(200).json({ success: true, data: requests })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const getRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findById(req.params.id)

    // when id has valid format but doesn't exist existent in db
    // fix returning { success: true, data: null }
    if (!request) {
      return res.status(400).json({ success: false})
    }
    
    res.status(200).json({ success: true, data: request })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const createRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.create(req.body)
    res.status(201).json({ success: true, data: request })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const updateRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // get updated data in response
      runValidators: true
    })

    if (!request) {
      return res.status(400).json({ success: false})
    }

    res.status(200).json({ success: true, data: request })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

const deleteRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: `Delete request ${req.params.id}` })
}

export default {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
}
